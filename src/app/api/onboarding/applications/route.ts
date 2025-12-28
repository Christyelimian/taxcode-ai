import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * GET /api/onboarding/applications
 * Fetch all onboarding applications (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if caller is admin
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded?.uid) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const callerRole = await getUserRole(decoded.uid);
    if (callerRole !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // 'pending', 'approved', 'rejected', or null for all

    let query = db.collection("onboardingApplications").orderBy("createdAt", "desc");
    
    if (statusFilter) {
      query = query.where("status", "==", statusFilter);
    }

    const snapshot = await query.get();
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      approvedAt: doc.data().approvedAt?.toDate?.()?.toISOString() || doc.data().approvedAt,
    }));

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}



