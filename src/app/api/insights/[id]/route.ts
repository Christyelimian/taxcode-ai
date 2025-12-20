import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/community-helpers';
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
    const prisma = getPrismaClient();

    // Try to find by ID first, then by slug
    const insight = await prisma.insight.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

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

    const prisma = getPrismaClient();

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
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    if (downloads !== undefined) updateData.downloads = downloads;

    // If title changed, update slug
    if (title) {
      const current = await prisma.insight.findUnique({ where: { id } });
      if (current && current.title !== title) {
        const newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const existing = await prisma.insight.findUnique({ where: { slug: newSlug } });
        updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
      }
    }

    const insight = await prisma.insight.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        data: insight,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating insight:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }
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
    const prisma = getPrismaClient();

    await prisma.insight.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Insight deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting insight:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete insight' },
      { status: 500 }
    );
  }
}

