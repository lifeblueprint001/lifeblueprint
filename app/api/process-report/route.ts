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

CALCULATED SYMBOLIC DATA:
Western Zodiac Sign: ${westernSign}
Chinese Zodiac Sign: ${chineseSign}
Life Path Number: ${lifePathNumber}
Expression / Destiny Number: ${expressionNumber}

---

LANGUAGE RULE:
Write in Croatian if the birth place suggests Croatia, Serbia, Bosnia and Herzegovina, Montenegro, Slovenia, or nearby Balkan region.
Otherwise write in English.
Use only one language.
In Croatian, use "ti", never "Vi".

---

CRITICAL ACCURACY RULES:

- You MUST actively use the calculated symbolic data.
- Always mention the Western Zodiac sign, Chinese Zodiac sign, Life Path Number, and Expression / Destiny Number by name.
- Do NOT say "your sign" without naming the actual sign or number.
- Do NOT invent ascendant, moon sign, houses, nakshatras, dashas, planetary degrees, or exact planetary placements.
- Use Western Sun sign, Chinese Zodiac sign, Life Path Number, and Expression Number as the verified symbolic base.
- Use Jyotish as a symbolic karmic and introspective framework, but do not claim exact Vedic placements.
- Be specific, not generic.
- Write in a personal, direct tone.
- Avoid clichés and vague statements.
- Do not repeat the same idea in different words.
- Make insights feel psychologically accurate.

---

CORE STYLE:

Write directly to the user.

The report should create reactions like:
- "This is exactly me."
- "How does this know that?"
- "I have never seen this explained this way."

Focus on:
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

Do NOT write like a newspaper horoscope.
Do NOT over-explain astrology.
Do NOT sound mystical just to sound mystical.

---

REPORT STRUCTURE:

# Tvoj Životni Plan

## 1. Glavni Obrazac Tvog Života

Start with a strong, personal opening.

Immediately describe the main life pattern visible from the combination of:
- ${westernSign}
- Chinese Zodiac: ${chineseSign}
- Life Path Number: ${lifePathNumber}
- Expression Number: ${expressionNumber}

This section must feel specific and slightly uncomfortable in a good way.

Do not start with generic lines like:
"Your existence carries strong energy..."
"Your journey is complex..."
"You are a unique person..."

Start directly with a concrete psychological pattern.

## 2. Tvoj Četverostruki Energetski Potpis

Explain how the four systems describe different layers of the person:

- Western Astrology: identity and outward personality through ${westernSign}
- Jyotish: karmic direction and inner development, without fake exact placements
- Numerology: life rhythm through Life Path ${lifePathNumber} and Expression ${expressionNumber}
- Chinese Zodiac: instinctive behavior through ${chineseSign}

Make this section clear but not academic.

## 3. Tvoj Glavni Unutarnji Sukob

Describe the central contradiction inside the user.

Make it concrete.

Focus on questions like:
- What do they want but resist?
- What do they show outside but hide inside?
- Where do they sabotage themselves?
- What pattern repeats when pressure increases?

Avoid generic emotional language.

## 4. Gdje Se Sustavi Preklapaju

This is the MOST IMPORTANT section.

Identify 4 major patterns that appear across multiple systems.

For each pattern, use this format:

### Pattern Name

Write:
- what this pattern looks like in daily life
- how it affects decisions
- how it appears in relationships or work
- which calculated symbols reinforce it

You MUST mention actual values:
- ${westernSign}
- ${chineseSign}
- Life Path ${lifePathNumber}
- Expression ${expressionNumber}

Do not list systems separately.
Synthesize them.

## 5. Emocionalni Blueprint

Describe:
- how the user processes emotions
- what they hide from others
- what drains them
- what makes them shut down
- what they secretly need but rarely ask for

Make this section sharp, intimate, and behavior-based.

Avoid sentences like:
"You feel emotions deeply."
Instead write specific behaviors.

## 6. Ljubav i Odnosi

Describe:
- how they attach emotionally
- what attracts them
- what triggers them
- what kind of partner brings out their best side
- what relationship pattern they must stop repeating

Make this feel personal and psychologically accurate.

## 7. Karijera, Novac i Smjer

Describe:
- what work environment fits them
- what pressure damages them
- how they make career decisions
- where they underestimate themselves
- what path can bring long-term growth

Make it practical, specific, and useful.

## 8. Životni Ciklusi Koji Se Ponavljaju

Describe recurring patterns in their life:

- starting strong then losing momentum
- intense focus followed by withdrawal
- overthinking
- self-sabotage
- delays
- sudden breakthroughs
- repeating relationship or career loops

Connect this to:
- Life Path ${lifePathNumber}
- Expression ${expressionNumber}
- ${westernSign}
- ${chineseSign}
- symbolic Jyotish karmic interpretation

## 9. Tvoja Sljedeća Faza

Do not make fixed predictions.

Use this contrast:

If you stay unconscious of this pattern, you may continue to...
If you consciously work with it, you can begin to...

Make it motivating but serious.

## 10. Konačna Poruka

End with a powerful personal message.

The closing should feel like a truth the user needed to hear.

Avoid generic motivational language.

---

QUALITY REQUIREMENTS:

- Write a long premium report.
- Make each section distinct.
- Use specific behavioral descriptions.
- The synthesis matters more than separate system descriptions.
- Every major section should connect back to actual calculated symbolic data.
- Avoid fake precision.
- Avoid generic horoscope language.
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