import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/community-helpers";

/**
 * GET /api/lessons/[moduleId]/[lessonIndex]
 * Get detailed content for a specific lesson
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; lessonIndex: string }> }
) {
  try {
    const { moduleId, lessonIndex } = await params;
    const index = parseInt(lessonIndex, 10);

    if (isNaN(index) || index < 0) {
      return NextResponse.json(
        { error: "Invalid lesson index" },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    const lesson = await prisma.lessonContent.findUnique({
      where: {
        moduleId_lessonIndex: {
          moduleId,
          lessonIndex: index,
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson content not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.lessonContent.update({
      where: { id: lesson.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        moduleId: lesson.moduleId,
        lessonIndex: lesson.lessonIndex,
        title: lesson.title,
        content: lesson.content,
        summary: lesson.summary,
        contentType: lesson.contentType,
        videoUrl: lesson.videoUrl,
        videoDuration: lesson.videoDuration,
        hasQuiz: lesson.hasQuiz,
        quizData: lesson.quizData,
        resources: lesson.resources,
        estimatedMinutes: lesson.estimatedMinutes,
        difficulty: lesson.difficulty,
        viewCount: lesson.viewCount + 1,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error fetching lesson content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch lesson content" },
      { status: 500 }
    );
  }
}
