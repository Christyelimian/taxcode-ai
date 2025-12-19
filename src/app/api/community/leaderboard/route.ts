import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/community-helpers";

// GET /api/community/leaderboard - Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get("type") || "xp"; // xp, answers, questions, reputation
    const limit = parseInt(searchParams.get("limit") || "50");

    let orderBy: any = {};
    if (type === "xp") {
      orderBy = { xp: "desc" };
    } else if (type === "answers") {
      orderBy = {
        answers: {
          _count: "desc",
        },
      };
    } else if (type === "questions") {
      orderBy = {
        questions: {
          _count: "desc",
        },
      };
    } else if (type === "reputation") {
      orderBy = { reputationScore: "desc" };
    }

    const users = await prisma.user.findMany({
      orderBy,
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        level: true,
        xp: true,
        reputationScore: true,
        isVerified: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

