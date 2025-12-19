import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * GET /api/learning/bookmarks
 * Get all bookmarked courses for the user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json({
        success: true,
        bookmarks: [],
      });
    }

    // Check learner role
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (decoded?.uid) {
      const userRole = await getUserRole(decoded.uid);
      if (!userRole || (userRole !== 'learner' && userRole !== 'admin')) {
        return NextResponse.json({
          success: true,
          bookmarks: [],
        });
      }
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    const bookmarks = await prisma.bookmarkedCourse.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        moduleId: bookmark.moduleId,
        moduleTitle: bookmark.moduleTitle,
        createdAt: bookmark.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Error getting bookmarks:", error);
    return NextResponse.json({
      success: true,
      bookmarks: [],
    });
  }
}
