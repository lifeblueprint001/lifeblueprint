export async function jyotishEngine({
  openai,
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: {
  openai: any;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}) {
  const prompt = `
Generate a structured Jyotish-style life direction analysis.

IMPORTANT:
Return ONLY valid JSON.

USER:
Name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

TASK:
Create a grounded Jyotish-style interpretation focused on:
- life lessons
- repeating patterns
- inner conflicts
- discipline
- responsibility
- growth direction
- relationship karma
- work and duty
- long-term personal evolution

Do NOT:
- predict exact events
- sound fatalistic
- use too much Sanskrit
- sound mystical or vague

Return ONLY this JSON structure:

{
  "lifeDirection": "",
  "karmicPattern": "",
  "innerConflict": "",
  "relationshipLesson": "",
  "workAndDutyPattern": "",
  "disciplineLesson": "",
  "growthDirection": "",
  "pastPattern": "",
  "presentChallenge": "",
  "futureDirection": ""
}

Each field:
- 2-4 sentences
- concrete
- grounded
- pattern-based
- not fortune telling

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
          "You are a structured Jyotish-style life pattern analysis engine that returns only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}