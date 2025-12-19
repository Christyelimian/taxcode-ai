import { NextResponse } from "next/server";
import { getCommunityUser } from "@/lib/community-helpers";

// GET /api/community/auth-check - Check if user is authenticated for community features
export async function GET() {
  try {
    const user = await getCommunityUser();
    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error: any) {
    console.error("Error checking community auth:", error);
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
