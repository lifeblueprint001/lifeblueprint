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
Generate a structured western astrology personality analysis.

IMPORTANT:
Return ONLY valid JSON.

Do NOT write:
- introductions
- conclusions
- markdown
- explanations outside JSON

==================================================
USER
==================================================

Name:
${fullName}

REAL ASTROLOGY DATA:
${astroSummary}

==================================================
TASK
==================================================

Analyze the natal placements and generate a realistic behavioral profile.

Focus on:
- real-world behavior
- communication
- ambition
- emotions
- work mentality
- social behavior
- stress reactions
- relationship patterns
- thinking style
- discipline
- creativity
- conflict style

IMPORTANT:
Do NOT reduce the person only to:
- fear
- vulnerability
- emotional withdrawal
- overthinking

The profile must feel:
- multidimensional
- realistic
- human
- behavior-focused

==================================================
OUTPUT FORMAT
==================================================

Return ONLY this JSON structure:

{
  "coreIdentity": "",
  "communicationStyle": "",
  "socialBehavior": "",
  "relationshipStyle": "",
  "workMentality": "",
  "emotionalPattern": "",
  "decisionMaking": "",
  "stressReaction": "",
  "conflictStyle": "",
  "leadershipStyle": "",
  "hiddenStrength": "",
  "blindSpot": "",
  "motivationPattern": "",
  "lifePattern": ""
}

==================================================
RULES
==================================================

Each field:
- must contain 2-5 sentences
- must feel specific
- must describe real behavior
- must avoid generic astrology language

Do not use:
- mystical language
- therapy tone
- vague spiritual wording

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
        "You are a structured western astrology behavioral analysis engine that returns only valid JSON.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],
});

  return response.choices[0].message.content;
}
