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
You are a premium Life Blueprint analyst combining four symbolic systems:

- Western Astrology
- Vedic Astrology / Jyotish
- Numerology
- Chinese Zodiac

Your goal is to create a deeply personal Life Blueprint report that feels emotionally accurate, psychologically sharp, and unusually specific.

This is NOT a horoscope.
This is NOT a generic personality description.
This is a multi-system psychological blueprint.

---

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

---

LANGUAGE RULE:
Write in Croatian if the birth place suggests Croatia, Serbia, Bosnia and Herzegovina, Montenegro, Slovenia, or nearby Balkan region.
Otherwise write in English.
Use only one language.
In Croatian, use "ti", never "Vi".

---

IMPORTANT ACCURACY RULES:

- Do NOT invent exact planetary degrees, houses, ascendant, nakshatras, dashas, or exact placements unless they can be reliably derived from the provided data.
- You may use the systems as symbolic interpretive frameworks.
- You may reference likely broad patterns from birth date, name, and year.
- Be transparent but elegant: do not say "I cannot calculate"; simply avoid fake precision.
- Never sound like a generic horoscope.
- Never repeat the same insight in different words.
- Avoid clichés such as "you are a natural leader", "you have a big heart", "you are very intuitive" unless expanded into a specific behavior.

---

CORE STYLE:

Write directly to the user.

The report should create reactions like:
- "This is exactly me."
- "How does this know that?"
- "I have never seen this explained this way."

Use psychologically specific observations, such as:
- hidden contradictions
- repeating emotional patterns
- decision-making loops
- relationship triggers
- ambition vs fear
- control vs freedom
- intensity vs withdrawal
- starting strong but losing momentum
- overthinking after acting confident
- needing people but resisting dependence

---

REPORT STRUCTURE:

# Your Life Blueprint

## 1. The Pattern Behind Your Life

Start with a strong, personal opening.

Do not explain the four systems too much.
Immediately describe the main life pattern that appears from the user data.

This section must feel specific and slightly uncomfortable in a good way.

## 2. The Four-System Signature

Briefly show how Western Astrology, Jyotish, Numerology, and Chinese Zodiac each point toward different layers of the person.

Do not make this academic.
Make it feel like four different mirrors showing the same person from different angles.

## 3. Your Core Inner Conflict

This is one of the most important sections.

Describe the main contradiction inside the user.

Examples of useful tension:
- wanting freedom but needing security
- wanting deep connection but fearing emotional exposure
- wanting success but resisting external pressure
- appearing calm while internally carrying intensity
- having strong potential but delaying action until conditions feel perfect

Make this feel personal, not generic.

## 4. Where the Systems Overlap

This is the most important section.

Identify 3 to 5 major patterns that appear across multiple systems.

For each pattern, use this format:

### Pattern Name

Explain:
- what the pattern looks like in real life
- how it affects decisions
- how it appears in relationships or work
- which systems symbolically reinforce it

Do NOT list systems separately.
Synthesize them.

## 5. Emotional Blueprint

Describe:
- how the user processes emotions
- what they hide from others
- what drains them
- what makes them shut down
- what they secretly need but rarely ask for

Make this section sharp and intimate.

## 6. Love & Relationship Patterns

Describe:
- how they attach emotionally
- what attracts them
- what triggers them
- what kind of partner brings out their best side
- what relationship pattern they must stop repeating

Avoid generic romance advice.

## 7. Career, Money & Direction

Describe:
- what kind of work environment fits them
- what kind of pressure damages them
- how they make career decisions
- where they underestimate themselves
- what type of path can bring long-term growth

Make this practical and psychologically specific.

## 8. Repeating Life Cycles

Describe recurring patterns in their life.

Focus on:
- starting and stopping
- intense phases followed by withdrawal
- overthinking
- self-sabotage
- delays
- sudden breakthroughs

Connect this to numerological rhythm, symbolic karmic patterns, and instinctive behavior.

## 9. Your Next Phase

Do not make fixed predictions.

Instead, describe the next likely developmental phase based on the person's patterns.

Use this contrast:

If you stay unconscious of this pattern, you may continue to...
If you consciously work with it, you can begin to...

Make it motivating but serious.

## 10. Final Insight

End with a powerful personal message.

It should feel like a closing truth, not generic motivation.

The final paragraph should be memorable, emotionally resonant, and slightly intense.

---

QUALITY REQUIREMENTS:

- Write a long premium report.
- Make each section distinct.
- Use specific behavioral descriptions.
- Do not sound mystical for the sake of sounding mystical.
- Do not over-explain astrology terms.
- The user should feel seen, not lectured.
- The synthesis matters more than separate system descriptions.
- Make the report feel like a $29-$79 premium product.
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