import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * GET /api/learning/bookmark?moduleId=xxx
 * Check if a course is bookmarked
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json({ bookmarked: false });
    }

    // Check learner role (bookmarks are for learners)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (decoded?.uid) {
      const userRole = await getUserRole(decoded.uid);
      if (!userRole || (userRole !== 'learner' && userRole !== 'admin')) {
        return NextResponse.json({ bookmarked: false });
      }
    }

    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json({ bookmarked: false });
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    const bookmark = await prisma.bookmarkedCourse.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
    });

    return NextResponse.json({ bookmarked: !!bookmark });
  } catch (error: any) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json({ bookmarked: false });
  }
}

/**
 * POST /api/learning/bookmark
 * Bookmark a course
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check learner role
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (decoded?.uid) {
      const userRole = await getUserRole(decoded.uid);
      if (!userRole || (userRole !== 'learner' && userRole !== 'admin')) {
        return NextResponse.json(
          { error: "Learner role required" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { moduleId, moduleTitle } = body;

    if (!moduleId) {
      return NextResponse.json(
        { error: "moduleId is required" },
        { status: 400 }
      );
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    const bookmark = await prisma.bookmarkedCourse.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        moduleId: moduleId,
        moduleTitle: moduleTitle || null,
      },
    });

    return NextResponse.json({
      success: true,
      bookmark,
    });
  } catch (error: any) {
    console.error("Error bookmarking course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to bookmark course" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/learning/bookmark?moduleId=xxx
 * Remove bookmark
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return NextResponse.json(
        { error: "moduleId is required" },
        { status: 400 }
      );
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    await prisma.bookmarkedCourse.delete({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Ignore if bookmark doesn't exist
    if (error.code === 'P2025') {
      return NextResponse.json({ success: true });
    }
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
