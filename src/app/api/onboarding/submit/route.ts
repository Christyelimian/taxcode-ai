import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-server";

/**
 * POST /api/onboarding/submit
 * Submit onboarding application for community educators or learners
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      state,
      lga,
      background,
      experience,
      motivation,
      availability,
      preferredMode,
      goals,
      interests,
      userId,
    } = body;

    // Validate required fields
    if (!type || !["educator", "learner"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid onboarding type. Must be 'educator' or 'learner'" },
        { status: 400 }
      );
    }

    if (!name || !email || !phone || !state) {
      return NextResponse.json(
        { error: "Name, email, phone, and state are required" },
        { status: 400 }
      );
    }

    // Validate educator-specific fields
    if (type === "educator") {
      if (!background || !experience || !motivation || !availability || !preferredMode) {
        return NextResponse.json(
          {
            error:
              "Professional background, experience, motivation, availability, and preferred mode are required for educators",
          },
          { status: 400 }
        );
      }
    }

    // Validate learner-specific fields
    if (type === "learner") {
      if (!goals || !interests) {
        return NextResponse.json(
          { error: "Learning goals and interests are required for learners" },
          { status: 400 }
        );
      }
    }

    const { db } = getFirebaseAdmin();
    if (!db) {
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 }
      );
    }

    // Save to Firestore
    const onboardingData = {
      type,
      name,
      email,
      phone,
      state,
      lga: lga || null,
      userId: userId || null,
      status: "pending", // pending, reviewed, approved, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
      // Type-specific fields
      ...(type === "educator"
        ? {
            background,
            experience,
            motivation,
            availability,
            preferredMode,
          }
        : {
            goals,
            interests,
            preferredMode: preferredMode || null,
          }),
    };

    const docRef = await db.collection("onboardingApplications").add(onboardingData);

    // Send email notification using Resend
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const applicationType = type === "educator" ? "Community Educator" : "Learner";
      const adminEmails = [
        process.env.ADMIN_EMAIL || "info@taxcode.com.ng",
        "info.lapinreform@gmail.com",
      ];

      // Email to admins
      await resend.emails.send({
        from: "TaxCode Academy <academy@taxcode.com.ng>",
        to: adminEmails,
        subject: `New ${applicationType} Application: ${name}`,
        html: `
          <h2>New ${applicationType} Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Location:</strong> ${state}${lga ? `, ${lga}` : ""}</p>
          ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ""}
          
          ${type === "educator" ? `
            <h3>Professional Background</h3>
            <p>${background.replace(/\n/g, "<br>")}</p>
            
            <h3>Teaching Experience</h3>
            <p>${experience.replace(/\n/g, "<br>")}</p>
            
            <h3>Motivation</h3>
            <p>${motivation.replace(/\n/g, "<br>")}</p>
            
            <p><strong>Availability:</strong> ${availability}</p>
            <p><strong>Preferred Mode:</strong> ${preferredMode}</p>
          ` : `
            <h3>Learning Goals</h3>
            <p>${goals.replace(/\n/g, "<br>")}</p>
            
            <h3>Areas of Interest</h3>
            <p>${interests.replace(/\n/g, "<br>")}</p>
            
            ${preferredMode ? `<p><strong>Preferred Learning Mode:</strong> ${preferredMode}</p>` : ""}
          `}
          
          <hr>
          <p><small>Application ID: ${docRef.id}</small></p>
          <p><small>Submitted at ${new Date().toISOString()}</small></p>
        `,
      });

      // Confirmation email to applicant
      await resend.emails.send({
        from: "TaxCode Academy <academy@taxcode.com.ng>",
        to: [email],
        subject: `Thank you for your ${applicationType} application`,
        html: `
          <h2>Application Received</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in joining TaxCode Academy as a ${applicationType.toLowerCase()}!</p>
          
          <p>We've received your application and our team will review it within 2-3 business days.</p>
          
          ${type === "educator" ? `
            <p>As a community educator, you'll help build tax literacy across Nigeria by teaching others about their tax rights and obligations.</p>
          ` : `
            <p>As a learner, you'll have access to free courses, progress tracking, and a supportive learning community.</p>
          `}
          
          <p>We'll contact you at ${email} or ${phone} once your application has been reviewed.</p>
          
          <p>Best regards,<br>TaxCode Academy Team</p>
          
          <hr>
          <p><small>Application ID: ${docRef.id}</small></p>
        `,
      });

      console.log("Onboarding application emails sent successfully");
    } catch (emailError) {
      console.error("Failed to send onboarding emails:", emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      data: { id: docRef.id },
      message: "Application submitted successfully",
    });
  } catch (error: any) {
    console.error("Error submitting onboarding application:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}



