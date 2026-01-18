import { NextRequest, NextResponse } from 'next/server';
import { firestoreContent } from '@/lib/firestore-content';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';

/**
 * GET /api/insights
 * Get all insights (public endpoint, filters published by default)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    const isFeatured = searchParams.get('featured') === 'true';

    // Check if user is admin for unpublished content
    let canAccessUnpublished = false;
    if (includeUnpublished) {
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const role = await getUserRole(decoded.uid);
          if (role === 'admin') {
            canAccessUnpublished = true;
          }
        }
      } catch (error) {
        console.error('Error verifying admin access:', error);
      }
    }

    const { insights } = await firestoreContent.getInsights({
      includeUnpublished: canAccessUnpublished,
      featured: isFeatured,
    });

    return NextResponse.json({
      success: true,
      data: insights,
      count: insights.length
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insights
 * Create a new insight (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded?.uid) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const role = await getUserRole(decoded.uid);
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      summary,
      body: content,
      tags = [],
      isPublished = false,
      isFeatured = false,
      publishedAt,
      downloads,
    } = body;

    // Validation
    if (!title || !category || !summary || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, summary, body' },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists and make it unique
    const existing = await firestoreContent.getInsightBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const insight = await firestoreContent.createInsight({
      title,
      slug,
      category,
      summary,
      body: content,
      tags: Array.isArray(tags) ? tags : [],
      isPublished,
      isFeatured,
      publishedAt: publishedAt ? new Date(publishedAt) : isPublished ? new Date() : undefined,
      downloads: downloads ?? null,
    });

    // Send email notification if insight is published
    let emailNotificationSent = false;
    let emailNotificationError = null;
    
    if (isPublished) {
      try {
        const { newsletterService } = await import('@/lib/newsletter-service');
        const notificationResult = await newsletterService.sendInsightPublicationNotification(insight);
        
        emailNotificationSent = notificationResult.success;
        if (notificationResult.success) {
          console.log('📧 Email notification sent via API:', { 
            service: notificationResult.service, 
            sent: notificationResult.sent 
          });
        } else {
          console.error('❌ Email notification failed via API:', notificationResult.error);
          emailNotificationError = notificationResult.error;
        }
      } catch (emailError) {
        console.error('❌ Error sending email notification via API:', emailError);
        emailNotificationError = emailError instanceof Error ? emailError.message : 'Unknown error';
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: insight,
        emailNotificationSent,
        emailNotificationError,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating insight:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create insight' },
      { status: 500 }
    );
  }
}

