import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * GET /api/learning/my-courses
 * Get all courses the user is enrolled in
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json({
        success: true,
        courses: [],
      });
    }

    // Check learner role
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session")?.value;
      if (sessionCookie) {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const userRole = await getUserRole(decoded.uid);
          if (!userRole || (userRole !== 'learner' && userRole !== 'admin')) {
            return NextResponse.json({
              success: true,
              courses: [],
              message: "Learner role required to access courses",
            });
          }
        }
      }
    } catch (authError) {
      // If auth check fails, still allow empty response
      console.warn("Auth check failed in my-courses:", authError);
      return NextResponse.json({
        success: true,
        courses: [],
        message: "Authentication check failed",
      });
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        lessonProgress: {
          where: {
            isCompleted: true,
          },
        },
      },
      orderBy: {
        lastAccessedAt: "desc",
      },
    });

    const courses = enrollments.map((enrollment) => ({
      id: enrollment.id,
      moduleId: enrollment.moduleId,
      moduleTitle: enrollment.moduleTitle,
      status: enrollment.status,
      progressPercent: enrollment.progressPercent,
      currentLessonIndex: enrollment.currentLessonIndex,
      xpEarned: enrollment.xpEarned,
      badgeEarned: enrollment.badgeEarned,
      startedAt: enrollment.startedAt.toISOString(),
      completedAt: enrollment.completedAt?.toISOString(),
      lastAccessedAt: enrollment.lastAccessedAt.toISOString(),
      completedLessons: enrollment.lessonProgress.length,
    }));

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error: any) {
    console.error("Error getting user courses:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      error: error,
    });
    
    // Return empty courses array instead of error to prevent UI crash
    return NextResponse.json({
      success: true,
      courses: [],
      error: error?.message || "Failed to load courses",
    });
  }
}

