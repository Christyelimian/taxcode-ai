// Newsletter Subscribers Service for Neon PostgreSQL
// Fetches active newsletter subscribers for email notifications
import { getPrismaClient } from '@/lib/community-helpers';

interface NewsletterSubscriber {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interests: string[];
  status: 'active' | 'inactive' | 'unsubscribed';
  subscribedAt: Date;
  source: string;
}

interface EmailNotificationData {
  subject: string;
  title: string;
  content: string;
  previewText?: string;
  category?: string;
}

class NewsletterService {
  private prisma: any;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Get all active newsletter subscribers
   */
  async getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const subscribers = await this.prisma.newsletterSubscription.findMany({
        where: {
          status: 'active',
        },
select: {
          email: true,
          frequency: true,
          interests: true,
          status: true,
          subscribedAt: true,
          source: true,
        },
      });

      return subscribers.map((subscriber: any) => ({
        ...subscriber,
        interests: Array.isArray(subscriber.interests) ? subscriber.interests : [],
        createdAt: subscriber.subscribedAt, // Map subscribedAt to createdAt for compatibility
      }));
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      return [];
    }
  }

  /**
   * Get subscribers by frequency preference
   */
  async getSubscribersByFrequency(frequency: 'daily' | 'weekly' | 'monthly'): Promise<NewsletterSubscriber[]> {
    try {
      const subscribers = await this.prisma.newsletterSubscription.findMany({
        where: {
          status: 'active',
          frequency: frequency,
        },
        select: {
          email: true,
          frequency: true,
          interests: true,
          status: true,
          createdAt: true,
          source: true,
        },
      });

      return subscribers.map((subscriber: any) => ({
        ...subscriber,
        interests: Array.isArray(subscriber.interests) ? subscriber.interests : [],
        createdAt: subscriber.subscribedAt, // Map subscribedAt to createdAt for compatibility
      }));
    } catch (error) {
      console.error(`Error fetching ${frequency} subscribers:`, error);
      return [];
    }
  }

  /**
   * Get subscribers by interest
   */
  async getSubscribersByInterest(interest: string): Promise<NewsletterSubscriber[]> {
    try {
      const subscribers = await this.prisma.newsletterSubscription.findMany({
        where: {
          status: 'active',
          interests: {
            has: interest,
          },
        },
        select: {
          email: true,
          frequency: true,
          interests: true,
          status: true,
          createdAt: true,
          source: true,
        },
      });

      return subscribers.map((subscriber: any) => ({
        ...subscriber,
        interests: Array.isArray(subscriber.interests) ? subscriber.interests : [],
        createdAt: subscriber.subscribedAt, // Map subscribedAt to createdAt for compatibility
      }));
    } catch (error) {
      console.error(`Error fetching subscribers with interest "${interest}":`, error);
      return [];
    }
  }

  /**
   * Get total subscriber count
   */
  async getSubscriberCount(): Promise<number> {
    try {
      const count = await this.prisma.newsletterSubscription.count({
        where: {
          status: 'active',
        },
      });
      return count;
    } catch (error) {
      console.error('Error getting subscriber count:', error);
      return 0;
    }
  }

  /**
   * Check if email notifications are configured
   */
  isEmailConfigured(): boolean {
    return !!(process.env.RESEND_API_KEY || (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID));
  }

  /**
   * Get email service preference (Resend or Mailchimp)
   */
  getEmailService(): 'resend' | 'mailchimp' {
    // Prefer Resend for transactional emails like insight notifications
    if (process.env.RESEND_API_KEY) {
      return 'resend';
    }
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID) {
      return 'mailchimp';
    }
    return 'resend'; // Default to Resend
  }

  /**
   * Format insight data for email template
   */
  formatInsightForEmail(insight: any): EmailNotificationData {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taxcode-ai.vercel.app';
    const insightUrl = `${baseUrl}/insights/${insight.slug}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Tax Insight Published</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .insight-title { color: #1e40af; margin-bottom: 10px; }
          .insight-summary { margin-bottom: 20px; color: #6b7280; }
          .read-more { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          .category { display: inline-block; background: #e5e7eb; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 New Tax Insight Published</h1>
        </div>
        <div class="content">
          <div class="category">${insight.category?.toUpperCase() || 'TAX'}</div>
          <h2 class="insight-title">${insight.title}</h2>
          <p class="insight-summary">${insight.summary}</p>
          <a href="${insightUrl}" class="read-more">Read Full Insight →</a>
          
          ${insight.authorName ? `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #6b7280;">
                <strong>Author:</strong> ${insight.authorName} ${insight.authorTitle ? `(${insight.authorTitle})` : ''}
              </p>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>You're receiving this email because you subscribed to Tax Code Insights.</p>
          <p><a href="${baseUrl}/unsubscribe">Unsubscribe</a> | <a href="${baseUrl}/manage-preferences">Manage Preferences</a></p>
        </div>
      </body>
      </html>
    `;

    return {
      subject: `📊 New Tax Insight: ${insight.title}`,
      title: insight.title,
      content: htmlContent,
      previewText: insight.summary,
      category: insight.category,
    };
  }

  /**
   * Send insight publication notification via Resend
   */
  async sendInsightNotificationViaResend(insight: any, subscribers: NewsletterSubscriber[]): Promise<{ success: boolean; sent: number; error?: string }> {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const emailData = this.formatInsightForEmail(insight);
      let sentCount = 0;
      let errors: string[] = [];

      // Send emails in batches to avoid rate limits
      const batchSize = 50;
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const promises = batch.map(async (subscriber) => {
          try {
            await resend.emails.send({
              from: process.env.FROM_EMAIL || 'notifications@taxcode-ai.vercel.app',
              to: subscriber.email,
              subject: emailData.subject,
              html: emailData.content,
            });
            return true;
          } catch (error) {
            console.error(`Failed to send to ${subscriber.email}:`, error);
            errors.push(`${subscriber.email}: ${error}`);
            return false;
          }
        });

        const results = await Promise.all(promises);
        sentCount += results.filter(r => r).length;
        
        // Small delay between batches to respect rate limits
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (errors.length > 0) {
        console.error('Some emails failed to send:', errors);
      }

      return {
        success: sentCount > 0,
        sent: sentCount,
        error: errors.length > 0 ? `${errors.length} emails failed` : undefined,
      };
    } catch (error) {
      console.error('Error sending Resend notifications:', error);
      return {
        success: false,
        sent: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send insight publication notification via Mailchimp campaign
   */
  async sendInsightNotificationViaMailchimp(insight: any): Promise<{ success: boolean; sent?: number; error?: string }> {
    try {
      const { mailchimpService } = await import('@/lib/mailchimp');
      const emailData = this.formatInsightForEmail(insight);

      // Create and send campaign
      const campaign = await mailchimpService.createCampaign({
        subject: emailData.subject,
        title: `New Insight: ${emailData.title}`,
        content: emailData.content,
        previewText: emailData.previewText,
      });

      await mailchimpService.sendCampaign(campaign.id);

      // Get campaign stats
      const report = await mailchimpService.getCampaignReport(campaign.id);

      return {
        success: true,
        sent: report.emails_sent,
      };
    } catch (error) {
      console.error('Error sending Mailchimp campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Main method to send insight publication notifications
   */
  async sendInsightPublicationNotification(insight: any): Promise<{ 
    success: boolean; 
    sent: number; 
    service: string; 
    error?: string;
  }> {
    if (!this.isEmailConfigured()) {
      return {
        success: false,
        sent: 0,
        service: 'none',
        error: 'Email service not configured. Please set up RESEND_API_KEY or Mailchimp credentials.',
      };
    }

    const service = this.getEmailService();
    
    if (service === 'mailchimp') {
      const result = await this.sendInsightNotificationViaMailchimp(insight);
      return {
        ...result,
        sent: result.sent || 0,
        service: 'mailchimp',
      };
    } else {
      const subscribers = await this.getActiveSubscribers();
      if (subscribers.length === 0) {
        return {
          success: false,
          sent: 0,
          service: 'resend',
          error: 'No active subscribers found',
        };
      }

      const result = await this.sendInsightNotificationViaResend(insight, subscribers);
      return {
        ...result,
        service: 'resend',
      };
    }
  }
}

// Export singleton instance
export const newsletterService = new NewsletterService();

// Export types for use in other files
export type { NewsletterSubscriber, EmailNotificationData };