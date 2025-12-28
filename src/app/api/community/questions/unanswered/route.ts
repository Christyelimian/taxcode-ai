import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/community-helpers";

// GET /api/community/questions/unanswered - Get unanswered questions
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      isHidden: false,
      status: "unanswered",
    };

    if (category) {
      where.category = category;
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: [
        { urgency: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
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

    const total = await prisma.question.count({ where });

    return NextResponse.json({
      questions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error("Error fetching unanswered questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch unanswered questions" },
      { status: 500 }
    );
  }
}




