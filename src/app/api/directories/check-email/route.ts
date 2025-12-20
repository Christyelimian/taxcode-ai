import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not initialized" },
        { status: 500 }
      );
    }

    // Check if consultant exists with this email
    const consultantsSnapshot = await db
      .collection("teamMembers")
      .where("email", "==", email.toLowerCase().trim())
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

    return NextResponse.json({
      success: true,
      found: true,
      consultantId: doc.id,
      name: data.name,
      claimToken: data.claimToken || null,
      claimed: data.claimed || false,
    });
  } catch (error: any) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check email" },
      { status: 500 }
    );
  }
}


