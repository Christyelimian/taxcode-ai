import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/session";
import { getClaimedConsultantId, getConsultantById } from "@/app/actions";

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

    // Get claimed consultant ID for this user
    const claimResult = await getClaimedConsultantId(decoded.uid);
    if (!claimResult.success || !claimResult.data) {
      return NextResponse.json({
        success: false,
        error: "No consultant profile claimed",
      });
    }

    // Get full consultant data
    const consultantResult = await getConsultantById(claimResult.data);
    if (!consultantResult.success || !consultantResult.data) {
      return NextResponse.json({
        success: false,
        error: "Consultant profile not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: consultantResult.data,
    });
  } catch (error: any) {
    console.error("Error fetching consultant profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch consultant profile" },
      { status: 500 }
    );
  }
}


