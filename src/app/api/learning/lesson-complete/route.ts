import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getTrainingModuleById } from "@/app/actions";
import { awardXP } from "@/lib/community-helpers";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * POST /api/learning/lesson-complete
 * Mark a lesson as completed and update progress
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
    const { moduleId, lessonIndex, lessonTitle, timeSpent, quizScore } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json(
        { error: "moduleId is required" },
        { status: 400 }
      );
    }

    if (typeof lessonIndex !== "number" || lessonIndex < 0) {
      return NextResponse.json(
        { error: "lessonIndex must be a non-negative number" },
        { status: 400 }
      );
    }

    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    // Get enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
      include: {
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this module" },
        { status: 404 }
      );
    }

    // Get module to calculate total lessons
    const moduleRes = await getTrainingModuleById(moduleId);
    if (!moduleRes.success || !moduleRes.data) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    const module = moduleRes.data;
    const totalLessons = module.content?.length ?? 0;

    // Check if lesson progress already exists
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_moduleId_lessonIndex: {
          userId: user.id,
          moduleId: moduleId,
          lessonIndex: lessonIndex,
        },
      },
    });

    // Update or create lesson progress
    const lessonProgress = existingProgress
      ? await prisma.lessonProgress.update({
          where: {
            userId_moduleId_lessonIndex: {
              userId: user.id,
              moduleId: moduleId,
              lessonIndex: lessonIndex,
            },
          },
          data: {
            isCompleted: true,
            completedAt: new Date(),
            lastAccessedAt: new Date(),
            timeSpent: timeSpent !== undefined ? (existingProgress.timeSpent + timeSpent) : existingProgress.timeSpent,
            quizScore: quizScore !== undefined ? quizScore : existingProgress.quizScore,
            quizAttempts: quizScore !== undefined ? existingProgress.quizAttempts + 1 : existingProgress.quizAttempts,
          },
        })
      : await prisma.lessonProgress.create({
          data: {
            userId: user.id,
            enrollmentId: enrollment.id,
            moduleId: moduleId,
            lessonIndex: lessonIndex,
            lessonTitle: lessonTitle || `Lesson ${lessonIndex + 1}`,
            isCompleted: true,
            completedAt: new Date(),
            firstAccessedAt: new Date(),
            lastAccessedAt: new Date(),
            timeSpent: timeSpent ?? 0,
            quizScore: quizScore !== undefined ? quizScore : undefined,
            quizAttempts: quizScore !== undefined ? 1 : 0,
          },
        });

    // Count completed lessons
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        moduleId: moduleId,
        isCompleted: true,
      },
    });

    // Calculate progress percentage
    const progressPercent = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    // Determine next lesson index
    const nextLessonIndex = lessonIndex + 1 < totalLessons ? lessonIndex + 1 : lessonIndex;

    // Check if module is completed
    const isCompleted = completedLessons >= totalLessons;

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progressPercent: progressPercent,
        currentLessonIndex: nextLessonIndex,
        status: isCompleted ? "completed" : "in_progress",
        completedAt: isCompleted ? new Date() : undefined,
        lastAccessedAt: new Date(),
      },
    });

    // Award XP for lesson completion (only if not already completed)
    let totalXP = 0;
    if (!existingProgress || !existingProgress.isCompleted) {
      const xpPerLesson = 50; // Base XP per lesson
      const xpBonus = quizScore !== undefined && quizScore >= 80 ? 25 : 0; // Bonus for good quiz score
      totalXP = xpPerLesson + xpBonus;

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          xpEarned: {
            increment: totalXP,
          },
        },
      });

      // Award XP to user
      await awardXP(user.id, totalXP, `Completed lesson in ${module.title}`);
    }

    // Check for module completion badge
    let badgeEarned = false;
    if (isCompleted && !enrollment.badgeEarned) {
      badgeEarned = true;
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { badgeEarned: true },
      });
    }

    return NextResponse.json({
      success: true,
      lessonProgress: {
        lessonIndex: lessonProgress.lessonIndex,
        isCompleted: lessonProgress.isCompleted,
        completedAt: lessonProgress.completedAt?.toISOString(),
      },
      enrollment: {
        progressPercent: updatedEnrollment.progressPercent,
        currentLessonIndex: updatedEnrollment.currentLessonIndex,
        status: updatedEnrollment.status,
        xpEarned: updatedEnrollment.xpEarned,
        badgeEarned: badgeEarned || updatedEnrollment.badgeEarned,
        isCompleted: isCompleted,
      },
      xpAwarded: totalXP,
    });
  } catch (error: any) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete lesson" },
      { status: 500 }
    );
  }
}

