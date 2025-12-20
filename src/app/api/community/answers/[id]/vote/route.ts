import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser, getPrismaClient, awardXP } from "@/lib/community-helpers";

// POST /api/community/answers/[id]/vote - Vote on answer
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
    const { voteType } = body; // "up" or "down"

    if (!voteType || !["up", "down"].includes(voteType)) {
      return NextResponse.json(
        { error: "Invalid vote type. Must be 'up' or 'down'" },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.findUnique({
      where: { id },
    });

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    if (answer.authorId === user.id) {
      return NextResponse.json(
        { error: "You cannot vote on your own answer" },
        { status: 403 }
      );
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: "answer",
          targetId: id,
        },
      },
    });

    let voteDelta = 0;
    let newVote;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        voteDelta = voteType === "up" ? -1 : 1;
      } else {
        // Change vote
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });
        voteDelta = voteType === "up" ? 2 : -2;
      }
    } else {
      // Create new vote
      newVote = await prisma.vote.create({
        data: {
          userId: user.id,
          targetType: "answer",
          targetId: id,
          voteType,
        },
      });
      voteDelta = voteType === "up" ? 1 : -1;
    }

    // Calculate vote changes
    let upvoteChange = 0;
    let downvoteChange = 0;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Removing vote
        if (voteType === "up") upvoteChange = -1;
        else downvoteChange = -1;
      } else {
        // Changing vote
        if (voteType === "up") {
          upvoteChange = 1;
          downvoteChange = -1;
        } else {
          upvoteChange = -1;
          downvoteChange = 1;
        }
      }
    } else {
      // New vote
      if (voteType === "up") upvoteChange = 1;
      else downvoteChange = 1;
    }

    // Update answer vote counts
    const updateData: any = {};
    if (upvoteChange !== 0) {
      updateData.upvotes = { increment: upvoteChange };
    }
    if (downvoteChange !== 0) {
      updateData.downvotes = { increment: downvoteChange };
    }

    const updated = await prisma.answer.update({
      where: { id },
      data: updateData,
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

    // Award XP to answer author if upvoted
    if (voteType === "up" && !existingVote) {
      await awardXP(answer.authorId, 5, "answer_upvoted");
      
      // Create notification
      await prisma.notification.create({
        data: {
          userId: answer.authorId,
          type: "answer_upvoted",
          content: `${user.name || "Someone"} upvoted your answer`,
          actionUrl: `/community/questions/${answer.questionId}`,
        },
      });
    }

    return NextResponse.json({ answer: updated });
  } catch (error: any) {
    console.error("Error voting on answer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to vote on answer" },
      { status: 500 }
    );
  }
}


