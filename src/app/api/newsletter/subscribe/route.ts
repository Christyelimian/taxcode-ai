import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mailchimpService } from '@/lib/mailchimp';
import { getPrismaClient } from '@/lib/community-helpers';

// Validation schema for newsletter subscription
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  interests: z.array(z.string()).default([]),
  source: z.string().default('footer'),
  consentGiven: z.boolean().default(true),
  consentIp: z.string().optional(),
  consentCountry: z.string().optional(),
});

// Validation schema for updating preferences
const updatePreferencesSchema = z.object({
  email: z.string().email('Invalid email address'),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  interests: z.array(z.string()).optional(),
});

// GET endpoint - check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    
    // Check local database
    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!subscription) {
      return NextResponse.json({ subscribed: false });
    }

    // Check Mailchimp status
    try {
      const mailchimpMember = await mailchimpService.getMember(email);
      return NextResponse.json({
        subscribed: true,
        status: subscription.status,
        frequency: subscription.frequency,
        interests: subscription.interests,
        mailchimpStatus: mailchimpMember?.status,
        syncStatus: subscription.syncStatus,
      });
    } catch (error) {
      // Mailchimp check failed, return local data
      return NextResponse.json({
        subscribed: true,
        status: subscription.status,
        frequency: subscription.frequency,
        interests: subscription.interests,
        syncStatus: subscription.syncStatus,
        mailchimpError: 'Unable to check Mailchimp status',
      });
    }
  } catch (error) {
    console.error('Newsletter GET error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

// POST endpoint - subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    const prisma = getPrismaClient();
    const email = validatedData.email.toLowerCase();

    // Get client IP for consent tracking
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Get country from IP (optional - you could use a geolocation service)
    const consentCountry = validatedData.consentCountry || 'unknown';

    // Save to local database first
    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email },
      update: {
        status: 'active',
        frequency: validatedData.frequency,
        interests: validatedData.interests,
        source: validatedData.source,
        consentGiven: validatedData.consentGiven,
        consentIp: validatedData.consentIp || clientIp,
        consentCountry: consentCountry,
        consentTimestamp: new Date(),
        syncStatus: 'pending',
        updatedAt: new Date(),
      },
      create: {
        email,
        status: 'active',
        frequency: validatedData.frequency,
        interests: validatedData.interests,
        source: validatedData.source,
        consentGiven: validatedData.consentGiven,
        consentIp: validatedData.consentIp || clientIp,
        consentCountry: consentCountry,
        consentTimestamp: new Date(),
        syncStatus: 'pending',
      },
    });

    // Sync with Mailchimp asynchronously
    try {
      const mailchimpMember = await mailchimpService.subscribeMember(
        email,
        validatedData.frequency,
        validatedData.interests,
        validatedData.source
      );

      // Update local database with Mailchimp info
      await prisma.newsletterSubscription.update({
        where: { email },
        data: {
          mailchimpId: mailchimpMember.id,
          syncStatus: 'synced',
          lastSyncAt: new Date(),
        },
      });
    } catch (mailchimpError) {
      console.error('Mailchimp sync error:', mailchimpError);
      
      // Update local database with sync error
      await prisma.newsletterSubscription.update({
        where: { email },
        data: {
          syncStatus: 'error',
          syncError: mailchimpError instanceof Error ? mailchimpError.message : 'Unknown error',
          lastSyncAt: new Date(),
        },
      });

      // Still return success, but note the sync issue
      return NextResponse.json({
        success: true,
        message: 'Subscribed successfully, but Mailchimp sync failed',
        subscriptionId: subscription.id,
        syncWarning: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

// PUT endpoint - update preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updatePreferencesSchema.parse(body);

    const prisma = getPrismaClient();
    const email = validatedData.email.toLowerCase();

    // Check if subscription exists
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'No subscription found for this email' },
        { status: 404 }
      );
    }

    // Update local database
    const updatedSubscription = await prisma.newsletterSubscription.update({
      where: { email },
      data: {
        ...(validatedData.frequency && { frequency: validatedData.frequency }),
        ...(validatedData.interests && { interests: validatedData.interests }),
        syncStatus: 'pending',
        updatedAt: new Date(),
      },
    });

    // Sync with Mailchimp
    try {
      await mailchimpService.updateMemberPreferences(
        email,
        validatedData.frequency,
        validatedData.interests
      );

      // Mark as synced
      await prisma.newsletterSubscription.update({
        where: { email },
        data: {
          syncStatus: 'synced',
          lastSyncAt: new Date(),
        },
      });
    } catch (mailchimpError) {
      console.error('Mailchimp preference sync error:', mailchimpError);
      
      // Update with sync error
      await prisma.newsletterSubscription.update({
        where: { email },
        data: {
          syncStatus: 'error',
          syncError: mailchimpError instanceof Error ? mailchimpError.message : 'Unknown error',
          lastSyncAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Newsletter preferences update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

// DELETE endpoint - unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    const emailLower = email.toLowerCase();

    // Update local database
    const subscription = await prisma.newsletterSubscription.update({
      where: { email: emailLower },
      data: {
        status: 'unsubscribed',
        syncStatus: 'pending',
        updatedAt: new Date(),
      },
    });

    // Sync with Mailchimp
    try {
      await mailchimpService.unsubscribeMember(emailLower);

      // Mark as synced
      await prisma.newsletterSubscription.update({
        where: { email: emailLower },
        data: {
          syncStatus: 'synced',
          lastSyncAt: new Date(),
        },
      });
    } catch (mailchimpError) {
      console.error('Mailchimp unsubscribe error:', mailchimpError);
      
      // Update with sync error
      await prisma.newsletterSubscription.update({
        where: { email: emailLower },
        data: {
          syncStatus: 'error',
          syncError: mailchimpError instanceof Error ? mailchimpError.message : 'Unknown error',
          lastSyncAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}