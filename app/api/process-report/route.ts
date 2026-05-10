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
    const astroSummary = JSON.stringify(natalData, null, 2); 
console.log("ASTRO DATA:", natalData);
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
You are creating an internal psychological-symbolic profile.

This profile is NOT shown to the user.

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

REAL ASTROLOGY API DATA:
${astroSummary}

IMPORTANT:
Use this real astrology data as the primary source.
If planets, signs, houses or aspects exist, use them.
Do NOT ignore this data.
CALCULATED SYMBOLIC DATA:
Western Zodiac Sign: ${westernSign}
Chinese Zodiac Sign: ${chineseSign}
Life Path Number: ${lifePathNumber}
Expression / Destiny Number: ${expressionNumber}

TASK:
Create a sharp internal profile.

RULES:
- Do NOT write a report.
- Do NOT give advice.
- Do NOT use generic horoscope language.
- Do NOT invent ascendant, moon sign, houses, nakshatras, dashas, degrees or exact planetary placements.
- Use the symbolic data as psychological archetypes.
- Every insight must describe behavior, not traits.

Create:

1. CORE LIFE TENSION
One strong paragraph.

2. 7 BEHAVIORAL PATTERNS
Each pattern must include:
- what the person does in real life
- what triggers it
- what they hide from others
- what it costs them
- which symbols reinforce it

3. 5 UNCOMFORTABLE TRUTHS
Sharp sentences that may feel too accurate.

4. RELATIONSHIP LOOP
Describe their repeated emotional pattern in love.

5. CAREER LOOP
Describe their repeated pattern with ambition, discipline, money and direction.

6. SELF-SABOTAGE LOOP
Describe how they delay, escape, overthink, restart or abandon things.

7. TRANSFORMATION EDGE
What life is forcing them to confront.

Make it psychologically specific, emotionally sharp, and not motivational.
`;

   const profileResponse = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: profilePrompt,
    },
  ],
  temperature: 0.9,
});

const internalProfile =
  profileResponse.choices[0]?.message?.content || "";

 const reportPrompt = `
You are writing a premium Life Blueprint report.

Use this internal profile as source material:

${internalProfile}

REAL ASTROLOGY API DATA:
${astroSummary}

IMPORTANT:
Use real astrology data actively.
Mention planets, signs, houses where relevant.
Do not rely only on generic symbolic data.
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

LANGUAGE RULE:
Write in Croatian if the birth place suggests Croatia, Serbia, Bosnia and Herzegovina, Montenegro, Slovenia, or nearby Balkan region.
Otherwise write in English.
Use only one language.
In Croatian, use "ti", never "Vi".

ABSOLUTE RULES:
- Do NOT sound like a horoscope.
- Do NOT sound like generic AI advice.
- Do NOT give advice in the first 80% of the report.
- Do NOT use phrases like "trebao bi", "pokušaj", "preporučujem", "razmotri", "bilo bi dobro".
- Do NOT write in formal Croatian.
- Use "ti", not "Vi".
- Do NOT invent exact astrology placements.
- Do NOT over-explain systems.
- Do NOT repeat the same pattern with different words.
- Do NOT use generic phrases like:
  "imaš veliki potencijal"
  "jako si intuitivan"
  "orijentiran si na detalje"
  "tvoje putovanje je složeno"
  "moraš vjerovati u sebe"

CORE WRITING STYLE:
Write like a direct private analysis.
Sharp, intimate, grounded, psychologically precise.

The text should feel like:
"ovo me pogodilo"
"ovo nisam očekivao"
"ovo je neugodno točno"

Do not motivate first.
Expose first.
Only at the end open the door toward transformation.

CRITICAL SYNTHESIS RULE:
Every major insight must connect at least 2 systems together.

Use:
- Western sign: ${westernSign}
- Chinese Zodiac: ${chineseSign}
- Life Path: ${lifePathNumber}
- Expression Number: ${expressionNumber}
- Jyotish only as symbolic karmic/introspective layer

Do NOT describe systems separately for too long.
Merge them into behavior.

EXAMPLE STYLE:
Not:
"Kao Djevica, ti si organiziran."

Better:
"${westernSign} ti daje potrebu da stvari imaju smisao prije nego kreneš, dok Life Path ${lifePathNumber} u tebi stalno otvara nemir prema novom. Zato često izgleda kao da znaš što radiš, ali iznutra istovremeno tražiš izlaz iz vlastitog plana."

REPORT STRUCTURE:

# Tvoj Životni Blueprint

## 1. Prva Istina

Start brutally directly.
No introduction.
No explanation of systems.

Open with the main repeating pattern in their life.

The first paragraph must feel personal and specific.

## 2. Obrazac Koji Te Najviše Vodi

Explain the dominant life pattern created by:
- ${westernSign}
- ${chineseSign}
- Life Path ${lifePathNumber}
- Expression ${expressionNumber}

Make it one connected psychological explanation.

## 3. Tvoj Glavni Unutarnji Rascjep

Describe the contradiction they live with.

Use real-life behaviors:
- how they start things
- how they withdraw
- how they overthink
- what they show others
- what they hide
- where they sabotage momentum

## 4. Četiri Obrasca Koja Se Stalno Ponavljaju

Create exactly 4 patterns.

Each pattern must have:

### Pattern name

Then write:
- what this looks like in daily life
- why people misunderstand it
- how it affects love
- how it affects work
- what it costs them internally
- which 2 or more systems point to the pattern

Make each pattern distinct.

## 5. Ono Što Ne Govoriš Naglas

This section must be intimate.

Describe:
- what they do not admit easily
- what hurts more than they show
- what drains them
- what they pretend does not matter
- what they secretly need but rarely ask for

Include at least 5 sentences that feel slightly uncomfortable but true.

## 6. Ljubav: Tvoj Emocionalni Kod

Describe:
- how they attach
- what they attract
- what they test in others
- when they pull away
- what kind of person sees through their defenses
- what relationship loop keeps repeating

No generic relationship advice.

## 7. Karijera, Novac i Smjer

Describe:
- how ambition works in them
- why they can start intensely and then stall
- what kind of work kills their energy
- what kind of work activates them
- how they relate to money, security and freedom
- where they underestimate themselves

Make it concrete.

## 8. Tvoje Skrivene Snage

Do not list obvious strengths.
Describe strengths that came from pressure, contradiction, observation, survival, sensitivity or discipline.

## 9. Tvoje Slijepe Točke

Be honest.

Describe:
- what they delay
- what they rationalize
- where they confuse thinking with progress
- where they choose control instead of growth
- where they already know the truth but wait too long to act

## 10. Sljedeća Faza

Now, and only now, shift toward transformation.

Use this structure:

Ako nastaviš po starom obrascu...
Ako postaneš svjestan tog obrasca...
Sljedeća faza od tebe traži...

Do not make fixed predictions.
Make it serious and grounded.

## 11. Konačna Poruka

End with a strong final message.
No clichés.
No generic motivation.
It should feel like a personal closing truth.

LENGTH:
Minimum 2200 words.
Maximum 3500 words.

QUALITY BAR:
This must feel like a paid premium product.
It must be sharper, deeper and more personal than a free AI horoscope.
The user should feel exposed, understood and emotionally hit.
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