import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { getUserRole } from "@/lib/user-roles";
import { cookies } from "next/headers";

/**
 * GET /api/user/role
 * Get current user's role
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded?.uid) {
      return NextResponse.json({
        role: null,
        authenticated: false,
      });
    }

    const userRole = await getUserRole(decoded.uid);

    return NextResponse.json({
      role: userRole || "user",
      authenticated: true,
    });
  } catch (error: any) {
    console.error("Error getting user role:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get user role" },
      { status: 500 }
    );
  }
}
