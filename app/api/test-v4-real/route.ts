import OpenAI from "openai";

import { westernEngine } from "@/lib/ai/westernEngine";
import { numerologyEngine } from "@/lib/ai/numerologyEngine";
import { jyotishEngine } from "@/lib/ai/jyotishEngine";
import { chineseEngine } from "@/lib/ai/chineseEngine";
import { synthesisEngine } from "@/lib/ai/synthesisEngine";
import { lifeBlueprintComposerV4 } from "@/lib/ai/composers/lifeBlueprintComposerV4";

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

function detectLanguage(birthPlace: string) {
  const place = birthPlace.toLowerCase();

  const balkanKeywords = [
    "croatia",
    "hrvatska",
    "serbia",
    "srbija",
    "bosnia",
    "bosna",
    "herzegovina",
    "hercegovina",
    "montenegro",
    "crna gora",
    "slovenia",
    "slovenija",
    "čakovec",
    "zagreb",
    "split",
    "rijeka",
    "osijek",
  ];

  return balkanKeywords.some((keyword) => place.includes(keyword))
    ? "Croatian"
    : "English";
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

  const response = await fetch("https://json.astrologyapi.com/v1/western_horoscope", {
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
  });

  if (!response.ok) {
    throw new Error("Astrology API error");
  }

  return await response.json();
}

function parseEngineJson(raw: string | null, engineName: string) {
  if (!raw) {
    throw new Error(`${engineName} returned empty response`);
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`${engineName} JSON parse error:`, raw);
    throw new Error(`${engineName} returned invalid JSON`);
  }
}

export async function POST(req: Request) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey || !process.env.ASTROLOGY_API_KEY) {
      return Response.json(
        {
          success: false,
          error: "Missing OPENAI_API_KEY or ASTROLOGY_API_KEY",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const {
      fullName,
      birthDate,
      birthTime,
      birthPlace,
    } = body;

    if (!fullName || !birthDate || !birthTime || !birthPlace) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: fullName, birthDate, birthTime, birthPlace",
        },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const language = detectLanguage(birthPlace);
    const chineseSign = getChineseZodiacSign(birthDate);
    const lifePathNumber = calculateLifePathNumber(birthDate);
    const expressionNumber = calculateExpressionNumber(fullName);

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
          success: false,
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

    console.log("TEST V4 REAL - ASTRO SUMMARY:", astroSummary);

    const westernRaw = await westernEngine({
      openai,
      astroSummary,
      fullName,
    });

    const numerologyRaw = await numerologyEngine({
      openai,
      fullName,
      lifePathNumber,
      expressionNumber,
    });

    const jyotishRaw = await jyotishEngine({
      openai,
      fullName,
      birthDate,
      birthTime,
      birthPlace,
    });

    const chineseRaw = await chineseEngine({
      openai,
      fullName,
      chineseSign,
    });

    const westernParsed = parseEngineJson(westernRaw, "westernEngine");
    const numerologyParsed = parseEngineJson(numerologyRaw, "numerologyEngine");
    const jyotishParsed = parseEngineJson(jyotishRaw, "jyotishEngine");
    const chineseParsed = parseEngineJson(chineseRaw, "chineseEngine");

    const synthesisRaw = await synthesisEngine({
      openai,
      western: westernParsed,
      numerology: numerologyParsed,
      jyotish: jyotishParsed,
      chinese: chineseParsed,
    });

    const synthesisParsed = parseEngineJson(synthesisRaw, "synthesisEngine");

    const report = await lifeBlueprintComposerV4({
      westernParsed,
      jyotishParsed,
      numerologyParsed,
      chineseParsed,
      synthesisParsed,
      language,
      fullName,
      birthDate,
      birthTime,
      birthPlace,
    });

    return Response.json({
      success: true,
      mode: "V4_REAL_TEST",
      language,
      calculated: {
        chineseSign,
        lifePathNumber,
        expressionNumber,
      },
      report,
      length: report.length,
    });
  } catch (error: any) {
    console.error("TEST V4 REAL ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error?.message || "Failed to generate V4 real test report",
      },
      { status: 500 }
    );
  }
}