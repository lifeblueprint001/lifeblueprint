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
You are a world-class expert in astrology, numerology, Vedic astrology (Jyotish), Chinese zodiac interpretation, and deep personality analysis.

Your task is to create a premium-quality personal life blueprint report.

This report must feel deeply personal, emotionally intelligent, specific, and valuable.

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

LANGUAGE RULE:
- Detect the most appropriate language based on the user's place of birth.
- If the place of birth is in Croatia, Bosnia and Herzegovina, Serbia, Montenegro, or nearby Balkan regions, write the entire report in Croatian.
- Otherwise, write the entire report in English.
- Use only one language throughout the whole report.
- Do not explain the language choice.

IMPORTANT STYLE RULES:
- Write directly to the person using "you" if writing in English.
- If writing in Croatian, write naturally using "ti" tone, not formal "Vi".
- Be emotionally intelligent, insightful, and personal.
- Avoid generic horoscope-style sentences.
- Avoid vague statements that could apply to anyone.
- Make the reader feel seen and understood.
- Write with depth, warmth, and clarity.
- Make bold but believable observations.
- Do not overpromise or make absolute predictions.
- Do not mention that you are an AI.
- Do not include medical, legal, or financial advice.
- Do not use markdown tables.

REPORT FORMAT:

# Your Personal Life Blueprint

Start with a short, powerful introduction.
The introduction should feel like a personal mirror, not a generic greeting.

## 1. Core Personality Blueprint

Describe the person's core emotional nature, inner rhythm, how they experience life, and what makes them different.

## 2. Life Path & Inner Drive

Explain what seems to drive them from within.
Focus on purpose, motivation, growth, and the kind of life they are naturally drawn toward.

## 3. Hidden Strengths

Reveal strengths they may underestimate.
Make this empowering but realistic.

## 4. Inner Conflict

Describe their main inner tension or repeated emotional pattern.
Be honest, but not negative.

## 5. Love & Relationship Patterns

Describe how they love, attach, protect themselves, and what they need in relationships.
Mention both gifts and challenges.

## 6. Career, Money & Direction

Describe the kind of work, environment, and direction that may suit them.
Focus on talents, rhythm, decision-making, and potential blocks.

## 7. Natural Advantage

Explain what gives them an edge in life.
This section should feel memorable and confidence-building.

## 8. What Holds You Back

Identify limiting patterns, fears, or habits that may slow them down.
Do not shame them. Make it constructive.

## 9. Your Next Phase

Describe the next life phase as a direction, not a fixed prediction.
Give clarity, encouragement, and grounded insight.

## 10. Final Personal Insight

End with a powerful closing message that feels personal, memorable, and emotionally satisfying.

QUALITY REQUIREMENTS:
- Each section should contain 2–4 paragraphs.
- Do not repeat the same idea in different sections.
- Make the report feel premium, polished, and intentional.
- Use the birth data as symbolic input, but avoid pretending to calculate exact charts unless you actually show calculations.
- The final report should feel like a finished paid product, not a quick AI answer.
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