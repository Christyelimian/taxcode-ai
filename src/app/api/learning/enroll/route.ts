import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getTrainingModuleById } from "@/app/actions";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * POST /api/learning/enroll
 * Enroll a user in a training module
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

    // Check if user has learner or admin role
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    
    if (!decoded?.uid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userRole = await getUserRole(decoded.uid);
    if (!userRole || (userRole !== 'learner' && userRole !== 'admin')) {
      return NextResponse.json(
        { 
          error: "Learner role required",
          message: "Please apply to become a learner to access courses. Visit /academy/onboard to apply."
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { moduleId } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json(
        { error: "moduleId is required" },
        { status: 400 }
      );
    }

    // Verify module exists and is published
    const moduleRes = await getTrainingModuleById(moduleId);
    if (!moduleRes.success || !moduleRes.data) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    const module = moduleRes.data;
    const isPublished = (module.status ?? "").toLowerCase() === "published";
    if (!isPublished) {
      return NextResponse.json(
        { error: "Module is not available for enrollment" },
        { status: 403 }
      );
    }

    // Check if already enrolled
    const { getPrismaClient } = await import("@/lib/community-helpers");
    const prisma = getPrismaClient();

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
    });

    if (existingEnrollment) {
      // Update last accessed
      const updated = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: { lastAccessedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        enrollment: {
          id: updated.id,
          status: updated.status,
          progressPercent: updated.progressPercent,
          currentLessonIndex: updated.currentLessonIndex,
        },
        message: "Already enrolled",
      });
    }

    // Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        moduleId: moduleId,
        moduleTitle: module.title,
        status: "in_progress",
        progressPercent: 0,
        currentLessonIndex: 0,
        startedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        progressPercent: enrollment.progressPercent,
        currentLessonIndex: enrollment.currentLessonIndex,
      },
    });
  } catch (error: any) {
    console.error("Error enrolling user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enroll" },
      { status: 500 }
    );
  }
}

