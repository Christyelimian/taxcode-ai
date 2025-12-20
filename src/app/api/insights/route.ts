import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/community-helpers';
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

    const prisma = getPrismaClient();

    const where: any = {};
    
    // Check if user is admin for unpublished content
    if (!includeUnpublished) {
      where.isPublished = true;
    } else {
      // Verify admin access
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const role = await getUserRole(decoded.uid);
          if (role !== 'admin') {
            where.isPublished = true; // Non-admins can't see unpublished
          }
        } else {
          where.isPublished = true; // Unauthenticated users can't see unpublished
        }
      } catch {
        where.isPublished = true;
      }
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    const insights = await prisma.insight.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: insights }, { status: 200 });
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
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const prisma = getPrismaClient();

    // Check if slug exists
    const existing = await prisma.insight.findUnique({ where: { slug } });
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const insight = await prisma.insight.create({
      data: {
        title,
        slug: finalSlug,
        category,
        summary,
        body: content,
        tags: Array.isArray(tags) ? tags : [],
        isPublished,
        isFeatured,
        publishedAt: publishedAt ? new Date(publishedAt) : isPublished ? new Date() : null,
        downloads: downloads || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: insight,
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

