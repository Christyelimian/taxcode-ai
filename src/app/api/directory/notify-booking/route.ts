import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json();
    
    // Email addresses to notify
    const adminEmails = [
      "info@taxcode.com.ng",
      "info.lapinreform@gmail.com",
    ];
    
    // Email content for admins
    const adminEmailBody = `
New Booking Request Received

Consultant: ${booking.consultantName} (${booking.consultantEmail})
Client: ${booking.clientName}
Client Email: ${booking.clientEmail}
Client Phone: ${booking.clientPhone}
Preferred Mode: ${booking.preferredMode}

Request Summary:
${booking.summary}

---
This is an automated notification from TaxCode Directory.
    `.trim();
    
    // Email content for client confirmation
    const clientEmailBody = `
Thank you for your booking request!

We've received your request to consult with ${booking.consultantName}.

Your request details:
- Consultant: ${booking.consultantName}
- Preferred mode: ${booking.preferredMode}
- Your message: ${booking.summary}

The consultant will review your request and respond within their stated response time.

Best regards,
TaxCode Team
    `.trim();
    
    // Email content for consultant notification
    const consultantEmailBody = `
New Booking Request

You have received a new consultation request from ${booking.clientName}.

Client Details:
- Name: ${booking.clientName}
- Email: ${booking.clientEmail}
- Phone: ${booking.clientPhone}
- Preferred mode: ${booking.preferredMode}

Request Summary:
${booking.summary}

Please respond within your stated SLA. You can manage this booking in your consultant dashboard.

Best regards,
TaxCode Directory
    `.trim();
    
    // TODO: Implement actual email sending using your email service
    // For now, we'll use a simple approach - you can integrate with:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Resend
    // - etc.
    
    // Example with fetch to an email service API:
    // For production, replace this with your actual email service
    console.log("📧 Booking notification (would send emails):");
    console.log("To admins:", adminEmails);
    console.log("Admin email body:", adminEmailBody);
    console.log("To client:", booking.clientEmail);
    console.log("Client email body:", clientEmailBody);
    
    // If you have an email service, uncomment and configure:
    /*
    const emailServiceUrl = process.env.EMAIL_SERVICE_URL;
    if (emailServiceUrl) {
      // Send to admins
      for (const adminEmail of adminEmails) {
        await fetch(emailServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: adminEmail,
            subject: `New Booking Request: ${booking.consultantName}`,
            body: adminEmailBody,
          }),
        });
      }
      
      // Send to client
      await fetch(emailServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.clientEmail,
          subject: `Booking Request Confirmation - ${booking.consultantName}`,
          body: clientEmailBody,
        }),
      });
      
      // Send to consultant
      await fetch(emailServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: booking.consultantEmail,
          subject: `New Booking Request from ${booking.clientName}`,
          body: consultantEmailBody,
        }),
      });
    }
    */
    
    // Log consultant notification (for now)
    console.log("📧 Consultant notification (would send email):");
    console.log("To consultant:", booking.consultantEmail);
    console.log("Consultant email body:", consultantEmailBody);
    
    return NextResponse.json({ success: true, message: "Notifications sent" });
  } catch (error: any) {
    console.error("Error sending booking notifications:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}




