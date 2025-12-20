import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/community-helpers';
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

    if (type) {
      where.type = type;
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: news }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    
    // Check if the error is about missing table
    const errorMessage = error?.message || '';
    if (errorMessage.includes('does not exist') || errorMessage.includes('News')) {
      console.error('⚠️  News table does not exist. Please run migrations: npx prisma migrate deploy');
      return NextResponse.json(
        { 
          error: 'Database migration required. The News table does not exist. Please run: npx prisma migrate deploy',
          migrationRequired: true 
        },
        { status: 503 }
      );
    }
    
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
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const prisma = getPrismaClient();

    // Check if slug exists
    const existing = await prisma.news.findUnique({ where: { slug } });
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug: finalSlug,
        type,
        summary,
        body: content,
        externalUrl: externalUrl || null,
        isPublished,
        publishedAt: publishedAt ? new Date(publishedAt) : isPublished ? new Date() : null,
      },
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
    
    // Check if the error is about missing table
    const errorMessage = error?.message || '';
    if (errorMessage.includes('does not exist') || errorMessage.includes('News')) {
      console.error('⚠️  News table does not exist. Please run migrations: npx prisma migrate deploy');
      return NextResponse.json(
        { 
          error: 'Database migration required. The News table does not exist. Please run: npx prisma migrate deploy',
          migrationRequired: true 
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create news' },
      { status: 500 }
    );
  }
}

