import { NextRequest, NextResponse } from "next/server";
import { getCommunityUser, getPrismaClient } from "@/lib/community-helpers";

// GET /api/community/questions - List questions
export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "newest"; // newest, trending, unanswered
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      isHidden: false,
    };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "trending") {
      orderBy = [
        { views: "desc" },
        { createdAt: "desc" },
      ];
    } else if (sort === "unanswered") {
      where.status = "unanswered";
      orderBy = { createdAt: "desc" };
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy,
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
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/community/questions - Create question
export async function POST(request: NextRequest) {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prisma = getPrismaClient();
    const body = await request.json();
    const { title, body: questionBody, category, tags, urgency } = body;

    if (!title || !questionBody || !category) {
      return NextResponse.json(
        { error: "Title, body, and category are required" },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        title,
        body: questionBody,
        category,
        tags: tags || [],
        urgency: urgency || "normal",
        authorId: user.id,
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
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    // Award XP for asking a question
    const { awardXP, checkBadges } = await import("@/lib/community-helpers");
    await awardXP(user.id, 10, "asked_question");
    await checkBadges(user.id);

    return NextResponse.json({ question }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create question" },
      { status: 500 }
    );
  }
}




