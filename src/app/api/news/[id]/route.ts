import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/community-helpers';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';

/**
 * GET /api/news/:id
 * Get a single news item by ID or slug
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const prisma = getPrismaClient();

    // Try to find by ID first, then by slug
    const news = await prisma.news.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!news) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }

    // Check if unpublished and user is not admin
    if (!news.isPublished) {
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const role = await getUserRole(decoded.uid);
          if (role !== 'admin') {
            return NextResponse.json({ error: 'News item not found' }, { status: 404 });
          }
        } else {
          return NextResponse.json({ error: 'News item not found' }, { status: 404 });
        }
      } catch {
        return NextResponse.json({ error: 'News item not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: true, data: news }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/news/:id
 * Update a news item (admin only)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const body = await request.json();

    const {
      title,
      type,
      summary,
      body: content,
      externalUrl,
      isPublished,
      publishedAt,
    } = body;

    const prisma = getPrismaClient();

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) {
      const validTypes = ['Press mention', 'Public statement', 'Commentary'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: `Type must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
      updateData.type = type;
    }
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.body = content;
    if (externalUrl !== undefined) updateData.externalUrl = externalUrl || null;
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished;
      if (isPublished && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

    // If title changed, update slug
    if (title) {
      const current = await prisma.news.findUnique({ where: { id } });
      if (current && current.title !== title) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const existing = await prisma.news.findUnique({ where: { slug: newSlug } });
        updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating news:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update news' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/news/:id
 * Delete a news item (admin only)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const prisma = getPrismaClient();

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'News item deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting news:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete news' },
      { status: 500 }
    );
  }
}

