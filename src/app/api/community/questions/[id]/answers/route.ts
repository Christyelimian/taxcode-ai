import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser, getPrismaClient, awardXP, checkBadges } from "@/lib/community-helpers";

// GET /api/community/questions/[id]/answers - Get answers for a question
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const prisma = getPrismaClient();
    const { id } = await context.params;

    const answers = await prisma.answer.findMany({
      where: {
        questionId: id,
        isHidden: false,
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
      orderBy: [
        { isVerified: "desc" },
        { upvotes: "desc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json({ answers });
  } catch (error: any) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch answers" },
      { status: 500 }
    );
  }
}

// POST /api/community/questions/[id]/answers - Create answer
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
    const body = await request.json();
    const { body: answerBody } = body;

    if (!answerBody) {
      return NextResponse.json(
        { error: "Answer body is required" },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (question.isLocked) {
      return NextResponse.json(
        { error: "This question is locked" },
        { status: 403 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        questionId: id,
        authorId: user.id,
        body: answerBody,
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

    // Update question status to answered
    await prisma.question.update({
      where: { id },
      data: { status: "answered" },
    });

    // Award XP for answering
    await awardXP(user.id, 20, "answered_question");
    await checkBadges(user.id);

    // Create notification for question author
    if (question.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          userId: question.authorId,
          type: "question_answered",
          content: `${user.name || "Someone"} answered your question: "${question.title}"`,
          actionUrl: `/community/questions/${id}`,
        },
      });
    }

    return NextResponse.json({ answer }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create answer" },
      { status: 500 }
    );
  }
}

