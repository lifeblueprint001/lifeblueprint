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
You are an expert in four systems:
- Western Astrology
- Vedic Astrology (Jyotish)
- Numerology
- Chinese Zodiac

Your task is to create a premium Life Blueprint report that clearly reflects a synthesis of these four systems.

This is NOT a generic personality report.
The reader must clearly feel that four different systems are being used and combined.

---

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

---

LANGUAGE RULE:
- Detect the user's language based on place of birth
- If from Croatia, Serbia, Bosnia, Montenegro or nearby → write in Croatian
- Otherwise → write in English
- Use ONLY one language
- Do not explain language choice

---

IMPORTANT RULES:

- Do NOT invent exact planetary positions
- Use each system as an interpretive symbolic framework
- Be specific, not generic
- Write in a personal, direct tone
- In Croatian use "ti", not "Vi"
- Avoid clichés and vague statements
- Make insights feel psychologically accurate

---

STRUCTURE:

# Your Life Blueprint – Four System Analysis

## 1. Introduction – How Your Blueprint Is Built

Briefly explain that this report combines:
Western Astrology, Jyotish, Numerology, and Chinese Zodiac.

Explain that the goal is to find patterns where these systems overlap.

---

## 2. Western Astrology Perspective

Describe personality tendencies, emotional patterns, and inner nature.

Focus on:
- identity
- emotional response
- external behavior

---

## 3. Vedic (Jyotish) Perspective

Focus on:
- karma
- life direction
- internal development

Make it feel deeper and more introspective.

---

## 4. Numerology Perspective

Interpret:
- life path energy
- repeating patterns
- personal rhythm

Focus on decision-making style and cycles.

---

## 5. Chinese Zodiac Perspective

Describe:
- instinctive behavior
- social patterns
- reactions under pressure

---

## 6. Where Everything Connects (Synthesis)

This is the MOST IMPORTANT part.

Identify patterns that appear across multiple systems.

Examples:
- repeated traits
- consistent emotional patterns
- shared strengths or weaknesses

Make it feel like:
"multiple systems are pointing to the same truth about you"

---

## 7. Core Personality Blueprint

Now combine everything into one clear personal description.

---

## 8. Love & Relationship Patterns

Describe:
- how they connect emotionally
- what they need
- what creates tension

---

## 9. Career & Direction

Explain:
- what environments suit them
- how they make decisions
- what blocks them

---

## 10. Your Next Phase

Describe current life direction.

Avoid fixed predictions.
Focus on patterns and momentum.

---

## 11. Final Insight

End with a strong, personal message.

Something memorable and emotionally resonant.

---

QUALITY REQUIREMENTS:

- Each section must feel meaningful and distinct
- Do NOT repeat the same idea
- Make the report feel structured and intentional
- The reader must feel this is a multi-system analysis
- Avoid sounding like a horoscope
- Avoid generic advice
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