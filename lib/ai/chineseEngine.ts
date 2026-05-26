export async function chineseEngine({
  openai,
  fullName,
  chineseSign,
}: {
  openai: any;
  fullName: string;
  chineseSign: string;
}) {
  const prompt = `
Generate a structured Chinese zodiac behavioral analysis.

IMPORTANT:
Return ONLY valid JSON.

USER:
Name: ${fullName}
Chinese Zodiac Sign: ${chineseSign}

TASK:
Analyze the Chinese zodiac sign as a behavioral layer.

Focus on:
- instinctive reactions
- social behavior
- adaptability
- emotional defense style
- public personality
- risk behavior
- relationship instincts
- work style
- hidden social strengths

Do NOT:
- sound mystical
- write fortune telling
- predict events
- use generic zodiac clichés

Return ONLY this JSON structure:

{
  "instinctiveStyle": "",
  "socialBehavior": "",
  "adaptability": "",
  "emotionalDefense": "",
  "publicPersonality": "",
  "riskPattern": "",
  "relationshipInstinct": "",
  "workStyle": "",
  "hiddenSocialStrength": "",
  "shadowPattern": ""
}

Each field:
- 2-4 sentences
- concrete
- realistic
- behavioral
- non-mystical

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
          "You are a structured Chinese zodiac behavioral analysis engine that returns only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}