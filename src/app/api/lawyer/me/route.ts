import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/session";
import { getClaimedConsultantId, getLawyerById } from "@/app/actions";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    
    if (!decoded?.uid) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get claimed lawyer ID for this user
    const claimResult = await getClaimedConsultantId(decoded.uid);
    if (!claimResult.success || !claimResult.data) {
      return NextResponse.json({
        success: false,
        error: "No lawyer profile claimed",
      });
    }

    // Get full lawyer data
    const lawyerResult = await getLawyerById(claimResult.data);
    if (!lawyerResult.success || !lawyerResult.data) {
      return NextResponse.json({
        success: false,
        error: "Lawyer profile not found",
      });
    }

    // Verify it's actually a lawyer
    if (!lawyerResult.data.isLawyer) {
      return NextResponse.json({
        success: false,
        error: "Profile is not a lawyer",
      });
    }

    return NextResponse.json({
      success: true,
      data: lawyerResult.data,
    });
  } catch (error: any) {
    console.error("Error fetching lawyer profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch lawyer profile" },
      { status: 500 }
    );
  }
}

