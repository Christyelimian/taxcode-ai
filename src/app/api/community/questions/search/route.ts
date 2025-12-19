import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/community-helpers";

// GET /api/community/questions/search - Search questions
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(request.url);
    
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!q) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const where: any = {
      isHidden: false,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { body: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
    };

    if (category) {
      where.category = category;
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: [
        { views: "desc" },
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
    console.error("Error searching questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search questions" },
      { status: 500 }
    );
  }
}

