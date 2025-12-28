import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/session";
import { getFirebaseAdmin } from "@/lib/firebase-server";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    
    if (!decoded?.uid || !decoded?.email) {
      return NextResponse.json({
        success: false,
        found: false,
      });
    }

    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json({
        success: false,
        found: false,
      });
    }

    // Check if consultant exists with user's email
    const consultantsSnapshot = await db
      .collection("teamMembers")
      .where("email", "==", decoded.email.toLowerCase().trim())
      .where("isConsultant", "==", true)
      .limit(1)
      .get();

    if (consultantsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        found: false,
      });
    }

    const doc = consultantsSnapshot.docs[0];
    const data = doc.data();

    // Only return if not claimed
    if (data.claimed) {
      return NextResponse.json({
        success: true,
        found: false,
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      consultantId: doc.id,
      claimToken: data.claimToken || null,
      name: data.name,
      claimed: false,
    });
  } catch (error: any) {
    console.error("Error checking user email:", error);
    return NextResponse.json({
      success: false,
      found: false,
    });
  }
}




