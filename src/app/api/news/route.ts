import { NextRequest, NextResponse } from 'next/server';
import { firestoreContent } from '@/lib/firestore-content';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';

/**
 * GET /api/news
 * Get all news items (public endpoint, filters published by default)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    const type = searchParams.get('type'); // Filter by type if provided

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

    const { news } = await firestoreContent.getNews({
      includeUnpublished: canAccessUnpublished,
      type: type || undefined,
    });

    return NextResponse.json({
      success: true,
      data: news,
      count: news.length
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/news
 * Create a new news item (admin only)
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
      type,
      summary,
      body: content,
      externalUrl,
      isPublished = false,
      publishedAt,
    } = body;

    // Validation
    if (!title || !type || !summary || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, summary, body' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['Press mention', 'Public statement', 'Commentary'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists and make it unique
    const existing = await firestoreContent.getNewsBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await firestoreContent.createNews({
      title,
      slug,
      type,
      summary,
      body: content,
      externalUrl: externalUrl || undefined,
      isPublished,
      publishedAt: publishedAt ? new Date(publishedAt) : isPublished ? new Date() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create news' },
      { status: 500 }
    );
  }
}

