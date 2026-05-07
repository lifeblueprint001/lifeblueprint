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
function getWesternZodiacSign(birthDate: string) {
  const date = new Date(birthDate);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

function getChineseZodiacSign(birthDate: string) {
  const year = new Date(birthDate).getUTCFullYear();

  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];

  return animals[(year - 1900) % 12];
}

function reduceToCoreNumber(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num
      .toString()
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return num;
}

function calculateLifePathNumber(birthDate: string) {
  const digits = birthDate.replace(/\D/g, "");

  const total = digits
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);

  return reduceToCoreNumber(total);
}

function calculateExpressionNumber(fullName: string) {
  const values: Record<string, number> = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9,
  };

  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  const total = normalized
    .split("")
    .reduce((sum, char) => sum + (values[char] || 0), 0);

  return reduceToCoreNumber(total);
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

    const westernSign = getWesternZodiacSign(birthDate);
    const chineseSign = getChineseZodiacSign(birthDate);
    const lifePathNumber = calculateLifePathNumber(birthDate);
    const expressionNumber = calculateExpressionNumber(fullName);                                                                                                                       


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

  const profilePrompt = `  
Create a deep psychological profile based on:

Western Sign: ${westernSign}
Chinese Zodiac: ${chineseSign}
Life Path: ${lifePathNumber}
Expression Number: ${expressionNumber}

Write:

- 5 personality patterns (real-life behavior)
- 3 internal conflicts
- 3 repeating life loops
- 2 hidden fears
- 2 underused strengths

Be specific.
Avoid generic statements.
Do NOT write a report.
`;

    const profileCompletion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: profilePrompt }
  ],
});

const internalProfile =
  profileCompletion.choices[0]?.message?.content || "";

    const reportPrompt = `
Use this psychological profile:

${internalProfile}

Write a premium Life Blueprint report.

RULES:
- Write in Croatian
- Be personal and specific
- Avoid generic phrases
- Expand into real-life situations
- Use:
  - ${westernSign}
  - ${chineseSign}
  - Life Path ${lifePathNumber}
  - Expression ${expressionNumber}

Make it feel like a paid product.

Write a long structured report.
`;

    const reportResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: reportPrompt,
    },
  ],
  temperature: 0.85,
});

const report =
  reportResponse.choices[0]?.message?.content || "No report generated.";

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