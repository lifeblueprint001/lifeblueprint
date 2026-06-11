export async function westernEngine({
  openai,
  astroSummary,
  fullName,
}: {
  openai: any;
  astroSummary: string;
  fullName: string;
}) {
  const prompt = `
Generate a structured Western natal chart interpretation.

IMPORTANT:
Return ONLY valid JSON.

Do NOT write:
- markdown
- introduction
- conclusion
- text outside JSON

USER:
Name: ${fullName}

REAL WESTERN ASTROLOGY DATA:
${astroSummary}

TASK:
Transform the natal placements into structured interpretation data.

This engine must NOT write the final report.
This engine must create detailed source material for a premium 25-35 page Life Blueprint PDF.

For every placement:
- explain what the planet/point represents
- mention the actual sign
- mention the actual house if available
- explain the meaning of the sign
- explain the meaning of the house
- explain how the combination appears in real life
- include work behavior
- include relationship behavior
- include emotional/psychological pattern
- include hidden strength
- include blind spot
- include one practical example

Do not be mystical.
Do not be vague.
Do not write generic horoscope language.
Translate astrology into real behavior.

Return ONLY this JSON structure:

{
  "ascendant": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "realLifeBehavior": "",
    "howOthersPerceiveYou": "",
    "workBehavior": "",
    "relationshipBehavior": "",
    "hiddenStrength": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "sun": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "realLifeBehavior": "",
    "workBehavior": "",
    "relationshipBehavior": "",
    "emotionalPattern": "",
    "hiddenStrength": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "moon": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "emotionalNeeds": "",
    "stressReaction": "",
    "relationshipBehavior": "",
    "privateSelf": "",
    "hiddenStrength": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "mercury": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "thinkingStyle": "",
    "communicationStyle": "",
    "decisionMaking": "",
    "workBehavior": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "venus": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "loveStyle": "",
    "relationshipNeeds": "",
    "attractionPattern": "",
    "emotionalExpression": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "mars": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "actionStyle": "",
    "conflictStyle": "",
    "ambitionPattern": "",
    "stressBehavior": "",
    "hiddenStrength": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "jupiter": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "growthPattern": "",
    "opportunityStyle": "",
    "beliefPattern": "",
    "hiddenPotential": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "saturn": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "signMeaning": "",
    "houseMeaning": "",
    "lifeLesson": "",
    "disciplinePattern": "",
    "fearOrPressurePoint": "",
    "maturityPath": "",
    "hiddenStrength": "",
    "blindSpot": "",
    "practicalExample": ""
  },
  "midheaven": {
    "sign": "",
    "house": "",
    "whatItRepresents": "",
    "careerDirection": "",
    "publicRole": "",
    "ambitionStyle": "",
    "practicalExample": ""
  },
  "westernSynthesis": {
    "corePattern": "",
    "mainContradiction": "",
    "relationshipTheme": "",
    "workTheme": "",
    "emotionalTheme": "",
    "lifeMechanism": "",
    "summary": ""
  }
}

RULES:
- Every string field should contain 2-5 sentences.
- Do not leave fields empty if data is available.
- If house is missing, write "not provided".
- Use the actual placements from REAL WESTERN ASTROLOGY DATA.
- Do not invent placements.
- Make the output detailed enough for a long premium report.
- Return ONLY JSON.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.65,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content:
          "You are a Western natal chart interpretation data engine. You return only valid JSON and transform chart placements into detailed structured interpretation material.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}