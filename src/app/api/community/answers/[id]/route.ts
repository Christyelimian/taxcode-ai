import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser, getPrismaClient } from "@/lib/community-helpers";

// PUT /api/community/answers/[id] - Update answer
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prisma = getPrismaClient();
    const { id } = await context.params;
    const body = await request.json();

    const answer = await prisma.answer.findUnique({
      where: { id },
    });

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    if (answer.authorId !== user.id && user.role !== "admin" && user.role !== "moderator") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updated = await prisma.answer.update({
      where: { id },
      data: {
        body: body.body,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            level: true,
            isVerified: true,
            reputationScore: true,
          },
        },
      },
    });

    return NextResponse.json({ answer: updated });
  } catch (error: any) {
    console.error("Error updating answer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update answer" },
      { status: 500 }
    );
  }
}

// DELETE /api/community/answers/[id] - Delete answer
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prisma = getPrismaClient();
    const { id } = await context.params;

    const answer = await prisma.answer.findUnique({
      where: { id },
      include: {
        question: true,
      },
    });

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    if (answer.authorId !== user.id && user.role !== "admin" && user.role !== "moderator") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.answer.delete({
      where: { id },
    });

    // Check if question still has answers
    const remainingAnswers = await prisma.answer.count({
      where: {
        questionId: answer.questionId,
        isHidden: false,
      },
    });

    if (remainingAnswers === 0) {
      await prisma.question.update({
        where: { id: answer.questionId },
        data: { status: "unanswered" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting answer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete answer" },
      { status: 500 }
    );
  }
}

