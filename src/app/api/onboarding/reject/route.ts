import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";
import { getUserRole } from "@/lib/user-roles";
import { verifySessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

/**
 * POST /api/onboarding/reject
 * Reject an onboarding application (Admin only)
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
    const { applicationId, reason } = body;

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
      status: "rejected",
      rejectedAt: new Date(),
      rejectedBy: decoded.uid,
      rejectionReason: reason || null,
      updatedAt: new Date(),
    });

    // Send rejection email
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
          subject: "Update on Your Application to TaxCode Academy",
          html: `
            <h2>Application Update</h2>
            <p>Dear ${applicationData.name},</p>
            <p>Thank you for your interest in joining TaxCode Academy.</p>
            <p>Unfortunately, we are unable to approve your application at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
            <p>If you have any questions or would like to reapply in the future, please don't hesitate to contact us.</p>
            <p>Best regards,<br>TaxCode Academy Team</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
      // Don't fail the rejection if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Application rejected successfully",
    });
  } catch (error: any) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject application" },
      { status: 500 }
    );
  }
}



