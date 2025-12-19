import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/community-helpers";

/**
 * GET /api/lessons/module/[moduleId]
 * Get all lesson content for a module
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;

    const prisma = getPrismaClient();
    const lessons = await prisma.lessonContent.findMany({
      where: { moduleId },
      orderBy: { lessonIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      lessons: lessons.map((lesson) => ({
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
        viewCount: lesson.viewCount,
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Error fetching module lessons:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
