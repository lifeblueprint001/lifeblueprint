import { NextRequest, NextResponse } from "next/server";
import { lifeBlueprintComposerV4 } from "@/lib/ai/composers/lifeBlueprintComposerV4";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      birthDate,
      birthTime,
      birthPlace,
      language = "Croatian",
      westernParsed,
      jyotishParsed,
      numerologyParsed,
      chineseParsed,
      synthesisParsed,
    } = body;

    if (!westernParsed) {
      return NextResponse.json(
        { error: "Missing westernParsed" },
        { status: 400 }
      );
    }

    if (!jyotishParsed) {
      return NextResponse.json(
        { error: "Missing jyotishParsed" },
        { status: 400 }
      );
    }

    if (!numerologyParsed) {
      return NextResponse.json(
        { error: "Missing numerologyParsed" },
        { status: 400 }
      );
    }

    if (!chineseParsed) {
      return NextResponse.json(
        { error: "Missing chineseParsed" },
        { status: 400 }
      );
    }

    if (!synthesisParsed) {
      return NextResponse.json(
        { error: "Missing synthesisParsed" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      report,
      length: report.length,
    });
  } catch (error: any) {
    console.error("TEST V4 REPORT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error while generating V4 report",
      },
      { status: 500 }
    );
  }
}