import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";
import { getTrainingModuleById } from "@/app/actions";

/**
 * POST /api/lessons
 * Create or update lesson content (Admin only)
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

    // TODO: Check if user is admin
    // For now, allow any authenticated user (restrict later)

    const body = await request.json();
    const {
      moduleId,
      lessonIndex,
      title,
      content,
      summary,
      videoUrl,
      videoDuration,
      hasQuiz,
      quizData,
      resources,
      estimatedMinutes,
      difficulty,
      contentType,
    } = body;

    // Validate required fields
    if (!moduleId || typeof lessonIndex !== "number" || !title || !content) {
      return NextResponse.json(
        { error: "moduleId, lessonIndex, title, and content are required" },
        { status: 400 }
      );
    }

    // Verify module exists
    const moduleRes = await getTrainingModuleById(moduleId);
    if (!moduleRes.success || !moduleRes.data) {
      return NextResponse.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    const module = moduleRes.data;
    if (lessonIndex < 0 || lessonIndex >= (module.content?.length ?? 0)) {
      return NextResponse.json(
        { error: "Invalid lesson index" },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();

    // Upsert lesson content
    const lesson = await prisma.lessonContent.upsert({
      where: {
        moduleId_lessonIndex: {
          moduleId,
          lessonIndex,
        },
      },
      update: {
        title,
        content,
        summary: summary || null,
        contentType: contentType || "markdown",
        videoUrl: videoUrl || null,
        videoDuration: videoDuration || null,
        hasQuiz: hasQuiz || false,
        quizData: hasQuiz && quizData ? quizData : null,
        resources: resources || null,
        estimatedMinutes: estimatedMinutes || 5,
        difficulty: difficulty || "beginner",
        updatedAt: new Date(),
      },
      create: {
        moduleId,
        lessonIndex,
        title,
        content,
        summary: summary || null,
        contentType: contentType || "markdown",
        videoUrl: videoUrl || null,
        videoDuration: videoDuration || null,
        hasQuiz: hasQuiz || false,
        quizData: hasQuiz && quizData ? quizData : null,
        resources: resources || null,
        estimatedMinutes: estimatedMinutes || 5,
        difficulty: difficulty || "beginner",
      },
    });

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        moduleId: lesson.moduleId,
        lessonIndex: lesson.lessonIndex,
        title: lesson.title,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error creating/updating lesson:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save lesson content" },
      { status: 500 }
    );
  }
}

