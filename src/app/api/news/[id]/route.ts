import { NextRequest, NextResponse } from 'next/server';
import { firestoreContent } from '@/lib/firestore-content';
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

    // Try to find by ID first, then by slug
    let news = await firestoreContent.getNewsById(id);
    if (!news) {
      news = await firestoreContent.getNewsBySlug(id);
    }

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

    // Increment view count (don't wait for it)
    firestoreContent.incrementNewsViews(news.id).catch(console.error);

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
    if (externalUrl !== undefined) updateData.externalUrl = externalUrl || undefined;
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished;
      if (isPublished && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : undefined;

    // If title changed, update slug
    if (title) {
      const current = await firestoreContent.getNewsById(id);
      if (current && current.title !== title) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const existing = await firestoreContent.getNewsBySlug(newSlug);
        updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }

    await firestoreContent.updateNews(id, updateData);

    // Return updated news
    const updatedNews = await firestoreContent.getNewsById(id);
    if (!updatedNews) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedNews,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating news:', error);
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

    // Check if news exists before deleting
    const existing = await firestoreContent.getNewsById(id);
    if (!existing) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }

    await firestoreContent.deleteNews(id);

    return NextResponse.json(
      {
        success: true,
        message: 'News item deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete news' },
      { status: 500 }
    );
  }
}

