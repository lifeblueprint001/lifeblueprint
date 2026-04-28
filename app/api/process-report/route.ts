import OpenAI from "openai";
import { Resend } from "resend";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !openaiApiKey ||
      !resendApiKey ||
      !stripeSecretKey ||
      !supabaseUrl ||
      !supabaseKey
    ) {
      return Response.json(
        { error: "Missing server environment variables" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const resend = new Resend(resendApiKey);
    const stripe = new Stripe(stripeSecretKey);
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    const {
      fullName,
      email,
      birthDate,
      birthTime,
      birthPlace,
      sessionId,
    } = body;

    if (
      !fullName ||
      !email ||
      !birthDate ||
      !birthTime ||
      !birthPlace ||
      !sessionId
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return Response.json(
        { error: "Payment not completed" },
        { status: 403 }
      );
    }

    // Anti-duplicate check:
    // If this Stripe session already has a report, return it instead of generating again.
    const { data: existingReport, error: existingReportError } = await supabase
      .from("reports")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existingReportError) {
      console.error("Supabase existing report check error:", existingReportError);
      return Response.json(
        { error: "Failed to check existing report" },
        { status: 500 }
      );
    }

    if (existingReport) {
      return Response.json({
        success: true,
        report: existingReport.report,
        userResult: existingReport.email_sent ? { alreadySent: true } : null,
        existing: true,
      });
    }

    const prompt = `
You are an expert astrologer, numerologist, Jyotish reader, and Chinese zodiac interpreter.

Create a highly personalized premium life report for this person.

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

INSTRUCTIONS:
- Combine Western astrology, Vedic astrology (Jyotish), numerology, and Chinese zodiac
- Write in a personal, insightful, emotionally intelligent tone
- Avoid generic lines
- Make it feel specific and premium
- Write directly to the person using "you"
- Focus on personality, inner conflicts, strengths, love patterns, career direction, and next phase in life

STRUCTURE:
1. Core Personality Blueprint
2. Your Life Path & Inner Drive
3. Hidden Strengths
4. Your Biggest Internal Conflict
5. Love & Relationship Patterns
6. Career, Money & Direction
7. Your Natural Advantage
8. What Keeps Holding You Back
9. Your Next Phase in Life
10. Final Personal Insight
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const report =
      aiResponse.choices[0]?.message?.content || "No report generated.";

    const safeReport = escapeHtml(report);

    const { error: insertError } = await supabase.from("reports").insert({
      full_name: fullName,
      email,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_place: birthPlace,
      stripe_session_id: sessionId,
      payment_status: "paid",
      report,
      email_sent: false,
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return Response.json(
        { error: "Failed to save report" },
        { status: 500 }
      );
    }

    const adminResult = await resend.emails.send({
      from: "Life Blueprint <onboarding@resend.dev>",
      to: ["lifeblueprint001@gmail.com"],
      subject: "New Life Blueprint submission",
      html: `
        <h1>New submission</h1>
        <p><strong>Full name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Date of birth:</strong> ${escapeHtml(birthDate)}</p>
        <p><strong>Time of birth:</strong> ${escapeHtml(birthTime)}</p>
        <p><strong>Place of birth:</strong> ${escapeHtml(birthPlace)}</p>
        <p><strong>Stripe session:</strong> ${escapeHtml(sessionId)}</p>
      `,
    });

    let userResult = null;
    let emailSent = false;

    try {
      userResult = await resend.emails.send({
        from: "Life Blueprint <onboarding@resend.dev>",
        to: ["lifeblueprint001@gmail.com"], // privremeno testiranje
        subject: "Your Life Blueprint Report",
        html: `
          <h1>Your Life Blueprint Report</h1>
          <p>Hi ${escapeHtml(fullName)},</p>
          <p>Your personalized report is ready:</p>
          <div style="white-space: pre-wrap; line-height: 1.6;">${safeReport}</div>
          <p style="margin-top:20px;">Thank you for your trust.</p>
        `,
      });

      emailSent = true;
    } catch (emailError) {
      console.error("User email failed:", emailError);
    }

    await supabase
      .from("reports")
      .update({ email_sent: emailSent })
      .eq("stripe_session_id", sessionId);

    return Response.json({
      success: true,
      report,
      adminResult,
      userResult,
      existing: false,
    });
  } catch (error) {
    console.error("Process report error:", error);

    return Response.json(
      { success: false, error: "Failed to process report" },
      { status: 500 }
    );
  }
}