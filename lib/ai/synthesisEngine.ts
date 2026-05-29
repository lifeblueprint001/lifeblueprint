export async function synthesisEngine({
  openai,
  western,
  numerology,
  jyotish,
  chinese,
}: {
  openai: any;
  western: any;
  numerology: any;
  jyotish: any;
  chinese: any;
}) {
  const prompt = `
You are an advanced behavioral synthesis engine.

Your task:
Combine 4 symbolic behavioral systems into ONE coherent human psychological profile.

SYSTEM DATA:

WESTERN:
${JSON.stringify(western, null, 2)}

NUMEROLOGY:
${JSON.stringify(numerology, null, 2)}

JYOTISH:
${JSON.stringify(jyotish, null, 2)}

CHINESE:
${JSON.stringify(chinese, null, 2)}

==================================================
IMPORTANT
==================================================

You are NOT writing a horoscope.

You are:
- identifying repeating human patterns
- finding contradictions
- detecting emotional dynamics
- finding behavioral loops
- identifying hidden strengths
- identifying self-sabotage patterns

==================================================
GOALS
==================================================

Find:

1. Core life pattern
2. Main contradiction
3. Life mechanism
4. Repeating loop
5. Recognition moments
6. Hidden contradictions
7. Relationship dynamic
8. Work pattern
9. Self-sabotage pattern
10. Hidden strength
11. Emotional defense
12. Present tension
13. Future direction

==================================================
VERY IMPORTANT
==================================================

DO NOT:
- repeat the systems separately
- explain astrology
- explain numerology
- sound mystical
- sound spiritual
- sound like therapy
- sound generic

This must feel:
- realistic
- intelligent
- psychologically grounded
- highly personal

==================================================
OUTPUT FORMAT
==================================================

Return ONLY this JSON structure:

{
  "corePattern": "",
  "mainContradiction": "",
  "lifeMechanism": "",
  "repeatingLoop": "",
  "recognitionMoments": [
    "",
    "",
    "",
    "",
    ""
  ],
  "hiddenContradictions": [
    "",
    "",
    ""
  ],
  "relationshipDynamic": "",
  "workPattern": "",
  "selfSabotagePattern": "",
  "hiddenStrength": "",
  "emotionalDefense": "",
  "presentTension": "",
  "futureDirection": "",
  "humanSummary": ""
}

==================================================
RULES
==================================================

Each field:
- 3-6 sentences
- specific
- human
- behavioral
- emotionally intelligent
- grounded in real life

RECOGNITION MOMENTS:

These are the most important outputs.

Each recognition moment should feel like:

"How does it know that?"

Examples:

- When you lose trust in someone, you rarely react immediately. You slowly reduce emotional investment first.

- You often make a decision internally long before you tell anyone about it.

- People often see your calm behavior but do not see how much mental processing is happening underneath.

Avoid generic statements.

Make them specific and realistic.


Return ONLY JSON.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",

    temperature: 0.8,

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content:
          "You are a behavioral synthesis intelligence engine that returns only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}