import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { lawyerId, documentType, price, clientName, clientEmail, clientPhone, notes } = body;

    if (!lawyerId || !documentType || !price || !clientName || !clientEmail || !clientPhone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get lawyer info
    const lawyerDoc = await db.collection("teamMembers").doc(lawyerId).get();
    if (!lawyerDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }

    const lawyer = lawyerDoc.data();
    if (!lawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer data not found" },
        { status: 404 }
      );
    }

    // Save document review request
    const reviewRequest = {
      lawyerId,
      documentType,
      price,
      clientName,
      clientEmail,
      clientPhone,
      notes: notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      type: "document_review",
    };

    await db.collection("documentReviewRequests").add(reviewRequest);

    // Send email to lawyer
    if (lawyer.email && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "TaxCode <noreply@taxcode.com.ng>",
        to: lawyer.email,
        subject: `New Document Review Request: ${documentType}`,
        html: `
          <h2>New Document Review Request</h2>
          <p><strong>Document Type:</strong> ${documentType}</p>
          <p><strong>Price:</strong> ₦${price.toLocaleString()}</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Phone:</strong> ${clientPhone}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/lawyer/document-reviews">View in Dashboard</a></p>
        `,
      });
    }

    // Send confirmation to client
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "TaxCode <noreply@taxcode.com.ng>",
      to: clientEmail,
      subject: `Document Review Request Confirmed: ${documentType}`,
      html: `
        <h2>Document Review Request Confirmed</h2>
        <p>Thank you for your request, ${clientName}!</p>
        <p><strong>Document Type:</strong> ${documentType}</p>
        <p><strong>Lawyer:</strong> ${lawyer.name}</p>
        <p><strong>Price:</strong> ₦${price.toLocaleString()}</p>
        <p>The lawyer will review your document and contact you within the specified timeframe.</p>
        <p>You can upload your document when the lawyer contacts you.</p>
      `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Document review request submitted successfully",
    });
  } catch (error: any) {
    console.error("Error submitting document review request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit request" },
      { status: 500 }
    );
  }
}


