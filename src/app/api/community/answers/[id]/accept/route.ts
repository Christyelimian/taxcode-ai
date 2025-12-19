import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser, getPrismaClient, awardXP } from "@/lib/community-helpers";

// POST /api/community/answers/[id]/accept - Accept answer as best answer
export async function POST(
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

    // Only question author can accept answer
    if (answer.question.authorId !== user.id) {
      return NextResponse.json(
        { error: "Only the question author can accept an answer" },
        { status: 403 }
      );
    }

    // Update question with accepted answer
    await prisma.question.update({
      where: { id: answer.questionId },
      data: {
        acceptedAnswerId: id,
        status: "answered",
      },
    });

    // Award XP to answer author
    await awardXP(answer.authorId, 50, "best_answer");

    // Create notification
    await prisma.notification.create({
      data: {
        userId: answer.authorId,
        type: "answer_accepted",
        content: `${user.name || "Someone"} accepted your answer as the best answer`,
        actionUrl: `/community/questions/${answer.questionId}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error accepting answer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept answer" },
      { status: 500 }
    );
  }
}

