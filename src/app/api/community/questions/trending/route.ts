import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/community-helpers";

// GET /api/community/questions/trending - Get trending questions
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(request.url);
    
    const limit = parseInt(searchParams.get("limit") || "10");
    const days = parseInt(searchParams.get("days") || "7"); // Trending in last N days

    const since = new Date();
    since.setDate(since.getDate() - days);

    const questions = await prisma.question.findMany({
      where: {
        isHidden: false,
        createdAt: {
          gte: since,
        },
      },
      orderBy: [
        { views: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            level: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Error fetching trending questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch trending questions" },
      { status: 500 }
    );
  }
}


