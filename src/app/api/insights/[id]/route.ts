import { NextRequest, NextResponse } from 'next/server';
import { firestoreContent } from '@/lib/firestore-content';
import { cookies } from 'next/headers';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';

/**
 * GET /api/insights/:id
 * Get a single insight by ID or slug
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Try to find by ID first, then by slug
    let insight = await firestoreContent.getInsightById(id);
    if (!insight) {
      insight = await firestoreContent.getInsightBySlug(id);
    }

    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    // Check if unpublished and user is not admin
    if (!insight.isPublished) {
      try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const role = await getUserRole(decoded.uid);
          if (role !== 'admin') {
            return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
          }
        } else {
          return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
        }
      } catch {
        return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
      }
    }

    // Increment view count (don't wait for it)
    firestoreContent.incrementInsightViews(insight.id).catch(console.error);

    return NextResponse.json({ success: true, data: insight }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching insight:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch insight' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/insights/:id
 * Update an insight (admin only)
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
      category,
      summary,
      body: content,
      tags,
      isPublished,
      isFeatured,
      publishedAt,
      downloads,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.body = content;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished;
      if (isPublished && !publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : undefined;
    if (downloads !== undefined) updateData.downloads = downloads;

    // If title changed, update slug
    if (title) {
      const current = await firestoreContent.getInsightById(id);
      if (current && current.title !== title) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const existing = await firestoreContent.getInsightBySlug(newSlug);
        updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }

    await firestoreContent.updateInsight(id, updateData);

    // Return updated insight
    const updatedInsight = await firestoreContent.getInsightById(id);
    if (!updatedInsight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedInsight,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating insight:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update insight' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/insights/:id
 * Delete an insight (admin only)
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

    // Check if insight exists before deleting
    const existing = await firestoreContent.getInsightById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }

    await firestoreContent.deleteInsight(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Insight deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting insight:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete insight' },
      { status: 500 }
    );
  }
}

