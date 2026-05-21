export async function numerologyEngine({
  openai,
  fullName,
  lifePathNumber,
  expressionNumber,
}: {
  openai: any;
  fullName: string;
  lifePathNumber: number;
  expressionNumber: number;
}) {
  const prompt = `
Generate a structured numerology behavioral analysis.

IMPORTANT:
Return ONLY valid JSON.

==================================================
USER
==================================================

Name:
${fullName}

Life Path Number:
${lifePathNumber}

Expression Number:
${expressionNumber}

==================================================
TASK
==================================================

Analyze:
- motivation
- internal drive
- movement through life
- ambition
- adaptability
- creativity
- discipline
- emotional rhythm
- life decisions
- personal evolution

IMPORTANT:
Numerology should NOT sound mystical.

Translate numerology into:
- real behavior
- life movement
- internal motivation
- decision patterns
- recurring tendencies

==================================================
OUTPUT FORMAT
==================================================

Return ONLY this JSON structure:

{
  "coreDrive": "",
  "motivationStyle": "",
  "adaptability": "",
  "disciplinePattern": "",
  "creativePattern": "",
  "emotionalRhythm": "",
  "decisionPattern": "",
  "socialExpression": "",
  "lifeMovement": "",
  "hiddenChallenge": "",
  "growthPattern": ""
}

==================================================
RULES
==================================================

Each field:
- 2-4 sentences
- concrete
- realistic
- behavioral
- non-mystical

Do NOT:
- sound spiritual
- sound like therapy
- sound generic

Return ONLY JSON.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    temperature: 0.7,

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content:
          "You are a structured numerology behavioral analysis engine that returns only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}