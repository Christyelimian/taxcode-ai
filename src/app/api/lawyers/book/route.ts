import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json();
    
    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not initialized" },
        { status: 500 }
      );
    }

    // Save booking request
    const bookingData = {
      ...booking,
      type: "lawyer",
      status: "pending",
      createdAt: new Date(),
    };
    const docRef = await db.collection("bookingRequests").add(bookingData);

    // Send email notifications
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Email to lawyer
      await resend.emails.send({
        from: "TaxCode Directory <directory@taxcode.com.ng>",
        to: [booking.lawyerEmail],
        subject: `New Legal Consultation Request from ${booking.name}`,
        html: `
          <h2>New Legal Consultation Request</h2>
          <p><strong>Client:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Preferred Mode:</strong> ${booking.preferredMode}</p>
          <p><strong>Issue Summary:</strong></p>
          <p>${booking.summary.replace(/\n/g, "<br>")}</p>
          <hr>
          <p>Please respond within ${booking.responseSlaHours || 24} hours. Login to your dashboard to accept/decline this request.</p>
        `,
      });

      // Email to client
      await resend.emails.send({
        from: "TaxCode Directory <directory@taxcode.com.ng>",
        to: [booking.email],
        subject: `Consultation Request Sent to ${booking.lawyerName}`,
        html: `
          <h2>Consultation Request Sent</h2>
          <p>Thank you for using TaxCode Legal Services Directory!</p>
          <p><strong>Lawyer:</strong> ${booking.lawyerName}</p>
          <p>The lawyer will review your request and respond within ${booking.responseSlaHours || 24} hours.</p>
        `,
      });

      console.log("Lawyer booking emails sent successfully");
    } catch (emailError) {
      console.error("Email notification failed (non-critical):", emailError);
    }

    return NextResponse.json({ success: true, data: { id: docRef.id } });
  } catch (error: any) {
    console.error("Error submitting lawyer booking:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit booking request" },
      { status: 500 }
    );
  }
}




