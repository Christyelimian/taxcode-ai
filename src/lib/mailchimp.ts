// Mailchimp Service Integration
// Handles all Mailchimp API operations for newsletter management

interface MailchimpConfig {
  apiKey: string;
  audienceId: string;
  serverPrefix: string;
}

interface MailchimpMember {
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending';
  interests?: Record<string, boolean>;
  merge_fields?: Record<string, any>;
  tags?: string[];
}

interface MailchimpList {
  id: string;
  name: string;
  stats: {
    member_count: number;
      unsubscribe_count: number;
      cleaned_count: number;
      member_count_since_send: number;
  };
}

interface MailchimpInterestCategory {
  id: string;
  title: string;
  display_order: number;
  type: string;
  interests: Array<{
    id: string;
    name: string;
    subscriber_count: number;
  }>;
}

class MailchimpService {
  private config: MailchimpConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      apiKey: process.env.MAILCHIMP_API_KEY!,
      audienceId: process.env.MAILCHIMP_AUDIENCE_ID!,
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX!
    };
    
    if (!this.config.apiKey || !this.config.audienceId || !this.config.serverPrefix) {
      throw new Error('Mailchimp configuration missing. Please check environment variables.');
    }

    this.baseUrl = `https://${this.config.serverPrefix}.api.mailchimp.com/3.0`;
  }

  private getAuthHeaders(): Record<string, string> {
    const auth = Buffer.from(`anystring:${this.config.apiKey}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get audience/list information
   */
  async getList(): Promise<MailchimpList> {
    const response = await fetch(`${this.baseUrl}/lists/${this.config.audienceId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Mailchimp list: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get interest categories for the audience
   */
  async getInterestCategories(): Promise<MailchimpInterestCategory[]> {
    const response = await fetch(`${this.baseUrl}/lists/${this.config.audienceId}/interest-categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get interest categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data.categories;
  }

  /**
   * Get interests for a specific category
   */
  async getInterests(categoryId: string): Promise<MailchimpInterestCategory['interests']> {
    const response = await fetch(`${this.baseUrl}/interest-categories/${categoryId}/interests`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get interests: ${response.statusText}`);
    }

    const data = await response.json();
    return data.interests;
  }

  /**
   * Add or update a member in the audience
   */
  async upsertMember(email: string, data: Partial<MailchimpMember> = {}): Promise<any> {
    const memberData: MailchimpMember = {
      email_address: email,
      status: data.status || 'subscribed',
      interests: data.interests || {},
      merge_fields: {
        ...data.merge_fields,
        FREQ: data.merge_fields?.FREQ || 'weekly', // Frequency preference
        SOURCE: data.merge_fields?.SOURCE || 'footer', // Subscription source
      },
      tags: data.tags || [],
    };

    // Use MD5 hash of email for member ID (Mailchimp requirement)
    const subscriberHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');

    const response = await fetch(`${this.baseUrl}/lists/${this.config.audienceId}/members/${subscriberHash}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to upsert member: ${response.statusText}. ${errorData.detail || ''}`);
    }

    return response.json();
  }

  /**
   * Subscribe a new member with frequency and interest preferences
   */
  async subscribeMember(
    email: string, 
    frequency: string = 'weekly',
    interests: string[] = [],
    source: string = 'footer'
  ): Promise<any> {
    // Map frequency to Mailchimp merge field
    const frequencyMap: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly', 
      monthly: 'Monthly'
    };

    // Get interest categories and map interest names to IDs
    const interestCategories = await this.getInterestCategories();
    const interestMap: Record<string, string> = {};

    for (const category of interestCategories) {
      const categoryInterests = await this.getInterests(category.id);
      for (const interest of categoryInterests) {
        interestMap[interest.name.toLowerCase().replace(/\s+/g, '_')] = interest.id;
      }
    }

    // Map selected interests to Mailchimp interest IDs
    const selectedInterests: Record<string, boolean> = {};
    for (const interest of interests) {
      const interestKey = interest.toLowerCase().replace(/\s+/g, '_');
      if (interestMap[interestKey]) {
        selectedInterests[interestMap[interestKey]] = true;
      }
    }

    return this.upsertMember(email, {
      status: 'subscribed',
      interests: selectedInterests,
      merge_fields: {
        FREQ: frequencyMap[frequency] || 'Weekly',
        SOURCE: source,
      },
    });
  }

  /**
   * Unsubscribe a member
   */
  async unsubscribeMember(email: string): Promise<any> {
    return this.upsertMember(email, {
      status: 'unsubscribed',
    });
  }

  /**
   * Update member preferences
   */
  async updateMemberPreferences(
    email: string,
    frequency?: string,
    interests?: string[]
  ): Promise<any> {
    const updateData: Partial<MailchimpMember> = {};

    if (frequency) {
      const frequencyMap: Record<string, string> = {
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly'
      };
      updateData.merge_fields = {
        FREQ: frequencyMap[frequency],
      };
    }

    if (interests) {
      // Get interest mapping
      const interestCategories = await this.getInterestCategories();
      const interestMap: Record<string, string> = {};

      for (const category of interestCategories) {
        const categoryInterests = await this.getInterests(category.id);
        for (const interest of categoryInterests) {
          interestMap[interest.name.toLowerCase().replace(/\s+/g, '_')] = interest.id;
        }
      }

      const selectedInterests: Record<string, boolean> = {};
      for (const interest of interests) {
        const interestKey = interest.toLowerCase().replace(/\s+/g, '_');
        if (interestMap[interestKey]) {
          selectedInterests[interestMap[interestKey]] = true;
        }
      }
      updateData.interests = selectedInterests;
    }

    return this.upsertMember(email, updateData);
  }

  /**
   * Check if member exists
   */
  async getMember(email: string): Promise<any> {
    const subscriberHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');

    const response = await fetch(`${this.baseUrl}/lists/${this.config.audienceId}/members/${subscriberHash}`, {
      headers: this.getAuthHeaders(),
    });

    if (response.status === 404) {
      return null; // Member doesn't exist
    }

    if (!response.ok) {
      throw new Error(`Failed to get member: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get member activity
   */
  async getMemberActivity(email: string): Promise<any> {
    const subscriberHash = require('crypto').createHash('md5').update(email.toLowerCase()).digest('hex');

    const response = await fetch(`${this.baseUrl}/lists/${this.config.audienceId}/members/${subscriberHash}/activity`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get member activity: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Batch subscribe members
   */
  async batchSubscribe(members: Array<{
    email: string;
    frequency?: string;
    interests?: string[];
    source?: string;
  }>): Promise<any> {
    const operations = members.map(member => ({
      method: 'PUT',
      path: `/lists/${this.config.audienceId}/members/${require('crypto').createHash('md5').update(member.email.toLowerCase()).digest('hex')}`,
      body: {
        email_address: member.email,
        status: 'subscribed',
        merge_fields: {
          FREQ: member.frequency || 'weekly',
          SOURCE: member.source || 'batch',
        },
      },
    }));

    const response = await fetch(`${this.baseUrl}/batches`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        operations: operations,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create batch operation: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create and send a campaign
   */
  async createCampaign(data: {
    subject: string;
    title: string;
    content: string;
    previewText?: string;
    segmentId?: string;
  }): Promise<any> {
    const campaignData = {
      type: 'regular',
      recipients: {
        list_id: this.config.audienceId,
        segment_opts: data.segmentId ? {
          saved_segment_id: data.segmentId,
        } : undefined,
      },
      settings: {
        subject_line: data.subject,
        title: data.title,
        preview_text: data.previewText,
        from_name: 'Tax Code Insights',
        reply_to: process.env.NOREPLY_EMAIL || 'noreply@taxcode.com',
        auto_footer: true,
        inline_css: true,
      },
    };

    // Create campaign
    const createResponse = await fetch(`${this.baseUrl}/campaigns`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(campaignData),
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create campaign: ${createResponse.statusText}`);
    }

    const campaign = await createResponse.json();

    // Set content
    const contentResponse = await fetch(`${this.baseUrl}/campaigns/${campaign.id}/content`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        html: data.content,
      }),
    });

    if (!contentResponse.ok) {
      throw new Error(`Failed to set campaign content: ${contentResponse.statusText}`);
    }

    return campaign;
  }

  /**
   * Send a campaign
   */
  async sendCampaign(campaignId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/campaigns/${campaignId}/actions/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to send campaign: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get campaign reports
   */
  async getCampaignReport(campaignId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/reports/${campaignId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get campaign report: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const mailchimpService = new MailchimpService();

// Export types for use in other files
export type {
  MailchimpConfig,
  MailchimpMember,
  MailchimpList,
  MailchimpInterestCategory,
};