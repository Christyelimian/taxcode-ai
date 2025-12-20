import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * GET /api/learning/progress?moduleId=xxx
 * Get user's progress for a specific module
 */
export async function GET(request: NextRequest) {
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

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
      include: {
        lessonProgress: {
          orderBy: { lessonIndex: "asc" },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this module" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        progressPercent: enrollment.progressPercent,
        currentLessonIndex: enrollment.currentLessonIndex,
        xpEarned: enrollment.xpEarned,
        badgeEarned: enrollment.badgeEarned,
        startedAt: enrollment.startedAt.toISOString(),
        completedAt: enrollment.completedAt?.toISOString(),
        lastAccessedAt: enrollment.lastAccessedAt.toISOString(),
      },
      lessons: enrollment.lessonProgress.map((lp) => ({
        lessonIndex: lp.lessonIndex,
        lessonTitle: lp.lessonTitle,
        isCompleted: lp.isCompleted,
        completedAt: lp.completedAt?.toISOString(),
        timeSpent: lp.timeSpent,
        quizScore: lp.quizScore,
        quizAttempts: lp.quizAttempts,
      })),
    });
  } catch (error: any) {
    console.error("Error getting progress:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get progress" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/learning/progress
 * Update user's progress (e.g., when accessing a lesson)
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
    const { moduleId, currentLessonIndex } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json(
        { error: "moduleId is required" },
        { status: 400 }
      );
    }

    if (typeof currentLessonIndex !== "number" || currentLessonIndex < 0) {
      return NextResponse.json(
        { error: "currentLessonIndex must be a non-negative number" },
        { status: 400 }
      );
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this module" },
        { status: 404 }
      );
    }

    // Update enrollment
    const updated = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        currentLessonIndex: currentLessonIndex,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      enrollment: {
        id: updated.id,
        currentLessonIndex: updated.currentLessonIndex,
        progressPercent: updated.progressPercent,
      },
    });
  } catch (error: any) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}

