import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";
import { getUserRole, setUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * POST /api/onboarding/approve
 * Approve an onboarding application and assign learner role (Admin only)
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { applicationId, userId, type } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    // Update application status
    await db.collection("onboardingApplications").doc(applicationId).update({
      status: "approved",
      approvedAt: new Date(),
      approvedBy: decoded.uid,
      updatedAt: new Date(),
    });

    // If user exists and type is learner, assign learner role
    if (userId && type === "learner") {
      try {
        await setUserRole(userId, "learner");
      } catch (error) {
        console.error("Error setting learner role:", error);
        // Continue even if role assignment fails
      }
    }

    // Send approval email
    try {
      const applicationDoc = await db
        .collection("onboardingApplications")
        .doc(applicationId)
        .get();
      const applicationData = applicationDoc.data();

      if (applicationData?.email) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "TaxCode Academy <academy@taxcode.com.ng>",
          to: [applicationData.email],
          subject: "Your Learner Application Has Been Approved!",
          html: `
            <h2>Application Approved!</h2>
            <p>Dear ${applicationData.name},</p>
            <p>Great news! Your application to join TaxCode Academy as a learner has been approved.</p>
            <p>You now have access to:</p>
            <ul>
              <li>Browse and enroll in courses</li>
              <li>Track your learning progress</li>
              <li>Earn XP and badges</li>
              <li>Access the learning dashboard</li>
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://taxcode.com.ng'}/academy" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Start Learning Now</a></p>
            <p>Best regards,<br>TaxCode Academy Team</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
      // Don't fail the approval if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Application approved successfully",
    });
  } catch (error: any) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve application" },
      { status: 500 }
    );
  }
}
