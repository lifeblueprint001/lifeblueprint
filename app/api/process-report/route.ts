import OpenAI from "openai";
import { Resend } from "resend";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { westernEngine } from "@/lib/ai/westernEngine";

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
async function getNatalChartData({
  birthDate,
  birthTime,
  lat,
  lon,
  tzone,
}: {
  birthDate: string;
  birthTime: string;
  lat: number;
  lon: number;
  tzone: number;
}) {
  const [year, month, day] = birthDate.split("-").map(Number);
  const [hour, min] = birthTime.split(":").map(Number);

  const response = await fetch(
    "https://json.astrologyapi.com/v1/western_horoscope",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
        "x-astrologyapi-key": process.env.ASTROLOGY_API_KEY!,
      },
      body: JSON.stringify({
        day,
        month,
        year,
        hour,
        min,
        lat,
        lon,
        tzone,
        house_type: "placidus",
        is_asteroids: "false",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Astrology API error");
  }

  return await response.json();
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

    const natalData = await getNatalChartData({
  birthDate,
  birthTime,
  lat: 46.3844,
  lon: 16.4339,
  tzone: 1,
});
if (natalData?.errorType || natalData?.errorMessage) {
  console.error("ASTROLOGY API FAILED:", natalData);

  return Response.json(
    {
      error: "Astrology API failed",
      details: natalData,
    },
    { status: 500 }
  );
}
    const getPlanet = (name: string) =>
  natalData.planets?.find((p: any) => p.name === name);

const getHouse = (house: number) =>
  natalData.houses?.find((h: any) => h.house === house);

const sun = getPlanet("Sun");
const moon = getPlanet("Moon");
const mercury = getPlanet("Mercury");
const venus = getPlanet("Venus");
const mars = getPlanet("Mars");
const jupiter = getPlanet("Jupiter");
const saturn = getPlanet("Saturn");

const ascendantHouse = getHouse(1);
const midheavenHouse = getHouse(10);

const astroSummary = `
ASCENDANT:
${ascendantHouse?.sign}

SUN:
${sun?.sign}, house ${sun?.house}

MOON:
${moon?.sign}, house ${moon?.house}

MERCURY:
${mercury?.sign}, house ${mercury?.house}

VENUS:
${venus?.sign}, house ${venus?.house}

MARS:
${mars?.sign}, house ${mars?.house}

JUPITER:
${jupiter?.sign}, house ${jupiter?.house}

SATURN:
${saturn?.sign}, house ${saturn?.house}

MIDHEAVEN:
${midheavenHouse?.sign}
`;
console.log("ASTRO DATA:", natalData);
    const westernSign = getWesternZodiacSign(birthDate);
    const westernAnalysis = await westernEngine({
  openai,
  astroSummary,
  fullName,
});
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
// TEMPORARILY DISABLED DUPLICATE CHECK

/*
if (existingReport) {
  return Response.json({
    success: true,
    report: existingReport.report,
    userResult: existingReport.email_sent ? { alreadySent: true } : null,
    existing: true,
  });
}
*/

   const report = JSON.stringify(
  JSON.parse(westernAnalysis),
  null,
  2
);
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
