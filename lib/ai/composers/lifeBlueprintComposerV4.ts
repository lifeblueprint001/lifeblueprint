import { westernComposer } from "./westernComposer";
import { jyotishComposer } from "./jyotishComposer";
import { numerologyComposer } from "./numerologyComposer";
import { chineseComposer } from "./chineseComposer";
import { synthesisComposer } from "./synthesisComposer";

type LifeBlueprintComposerV4Input = {
  westernParsed: any;
  jyotishParsed: any;
  numerologyParsed: any;
  chineseParsed: any;
  synthesisParsed: any;
  language?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export async function lifeBlueprintComposerV4({
  westernParsed,
  jyotishParsed,
  numerologyParsed,
  chineseParsed,
  synthesisParsed,
  language = "Croatian",
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: LifeBlueprintComposerV4Input): Promise<string> {
  if (!westernParsed) {
    throw new Error("lifeBlueprintComposerV4: westernParsed is missing.");
  }

  if (!jyotishParsed) {
    throw new Error("lifeBlueprintComposerV4: jyotishParsed is missing.");
  }

  if (!numerologyParsed) {
    throw new Error("lifeBlueprintComposerV4: numerologyParsed is missing.");
  }

  if (!chineseParsed) {
    throw new Error("lifeBlueprintComposerV4: chineseParsed is missing.");
  }

  if (!synthesisParsed) {
    throw new Error("lifeBlueprintComposerV4: synthesisParsed is missing.");
  }

  const sharedUserData = {
    language,
    fullName,
    birthDate,
    birthTime,
    birthPlace,
  };

  const westernReport = await westernComposer({
    westernParsed,
    ...sharedUserData,
  });

  const jyotishReport = await jyotishComposer({
    jyotishParsed,
    ...sharedUserData,
  });

  const numerologyReport = await numerologyComposer({
    numerologyParsed,
    ...sharedUserData,
  });

  const chineseReport = await chineseComposer({
    chineseParsed,
    ...sharedUserData,
  });

  const synthesisReport = await synthesisComposer({
    synthesisParsed,
    westernParsed,
    jyotishParsed,
    numerologyParsed,
    chineseParsed,
    ...sharedUserData,
  });

  const report = `
# LIFE BLUEPRINT

${fullName ? `## ${fullName}` : ""}

---

${westernReport}

---

${jyotishReport}

---

${numerologyReport}

---

${chineseReport}

---

${synthesisReport}
`;

  return report.trim();
}