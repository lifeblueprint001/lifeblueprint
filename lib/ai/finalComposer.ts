export async function finalComposer({
  openai,
  fullName,
  birthDate,
  birthTime,
  birthPlace,
  western,
  numerology,
  jyotish,
  chinese,
  synthesis,
}: {
  openai: any;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  western: any;
  numerology: any;
  jyotish: any;
  chinese: any;
  synthesis: any;
}) {
  const prompt = `
Write the final premium Life Blueprint report.

This report is based on structured analysis from four systems:
Western astrology, Jyotish-style life direction, numerology, and Chinese zodiac.

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

WESTERN ANALYSIS:
${JSON.stringify(western, null, 2)}

NUMEROLOGY ANALYSIS:
${JSON.stringify(numerology, null, 2)}

JYOTISH ANALYSIS:
${JSON.stringify(jyotish, null, 2)}

CHINESE ZODIAC ANALYSIS:
${JSON.stringify(chinese, null, 2)}

SYNTHESIS:
${JSON.stringify(synthesis, null, 2)}

==================================================
LANGUAGE RULE
==================================================

Write the final report in Croatian if the birth place suggests Croatia, Serbia, Bosnia and Herzegovina, Montenegro, Slovenia, North Macedonia or nearby Balkan region.
Otherwise write the final report in English.

Use only one language in the final report.

If writing in Croatian:
- use "ti"
- never use "Vi"
- avoid Serbian forms such as "raport", "porodica", "osjećanja"
- prefer Croatian forms such as "izvještaj", "obitelj", "osjećaji"

==================================================
STYLE
==================================================

The report must feel:
- premium
- personal
- grounded
- structured
- intelligent
- emotionally specific
- worth paying for

It must NOT feel:
- like raw JSON
- like a generic horoscope
- like therapy
- like motivational coaching
- like spiritual fantasy

Avoid overusing:
"energija", "vibracija", "svemir", "manifestacija", "putovanje", "sudbina".

Do not diagnose.
Do not predict exact future events.
Use future direction only as pattern-based guidance.

==================================================
CORE PRODUCT GOAL
==================================================

The user should not only think:
"This is interesting."

The user should think:
"This explains how I function."

The strongest parts of the report must be:
- recognition moments
- micro behaviors
- hidden contradictions
- life mechanism
- decision loop
- public self vs private self

Focus on small real-life behaviors, not only broad personality descriptions.

==================================================
REPORT STRUCTURE
==================================================

Use this exact structure in the final report language:

# LIFE BLUEPRINT
## Personal Life Pattern Analysis

Name:
Birth date:
Birth time:
Birth place:

## 1. How to Read This Report

Explain briefly that this is a multi-system behavioral analysis, not fortune telling.

## 2. Your Chart and Symbolic Code

Show the user the key input layers in a clean way:
- key western astrology placements
- numerology numbers
- Jyotish-style life direction
- Chinese zodiac sign

Explain briefly what each layer contributes.
Do not go too technical.
This section should build trust and show that the report is based on actual symbolic data.

## 3. Western Astrology: Your Core Psychological Map

Explain the western astrology layer through real behavior:
- identity
- communication
- relationships
- work mentality
- emotions
- conflict
- hidden strength

Mention relevant placements when useful.
Always connect placements to real-life behavior.

## 4. Numerology: Your Inner Drive

Explain:
- life path
- expression pattern
- motivation
- adaptability
- creativity
- discipline
- hidden challenge

## 5. Jyotish Direction: The Deeper Life Pattern

Explain:
- life direction
- karmic/repeating pattern
- inner conflict
- relationship lesson
- work and duty
- present challenge
- future direction without prediction

## 6. Chinese Zodiac: Instinct and Social Behavior

Explain:
- instinctive style
- public personality
- adaptability
- emotional defense
- social strengths
- shadow pattern

## 7. Main Synthesis: The Pattern Repeating Through Your Life

This is one of the most important sections.
Use synthesis strongly.

Must include:
- core pattern
- main contradiction
- life mechanism
- repeating loop
- present tension
- emotional defense
- self-sabotage
- hidden strength

## 8. Recognition Moments

Use synthesis.recognitionMoments.

Write 10-15 short, sharp recognition moments.

These must feel like:
"How does it know that?"

Rules:
- concrete
- direct
- realistic
- no spiritual language
- no generic self-help
- each point should describe a small real-life behavior

## 9. Micro Behaviors People Around You Rarely Notice

Use synthesis.microBehaviors.

Write them as short observations.

Each observation should feel:
"That is exactly what I do."

Do not over-explain.
Do not turn them into therapy advice.
Describe observable behavior.

## 10. Relationship Triggers

Use synthesis.relationshipTriggers.

Explain:
- what causes emotional reactions
- what breaks trust
- what creates distance
- what creates connection

Use real-life examples.

## 11. How You Actually Make Decisions

Use synthesis.decisionLoop.

Show the actual sequence.

Example format:
Idea → Research → Optimism → Risk detection → Delay → Decision

Explain how this pattern repeats through life.

## 12. Public Self vs Private Self

Use synthesis.privateVsPublicSelf.

Create two subsections:

### Public Self

### Private Self

The contrast should feel surprisingly accurate.

Show how the person appears externally versus how they actually experience situations internally.

## 13. Hidden Contradictions

Use synthesis.hiddenContradictions.

Explain the contradictions between:
- what the person wants
- what the person actually does
- what creates tension
- what repeats in life

Make this section honest but not cruel.

## 14. Relationships and Emotional Closeness

Explain relationship dynamic in concrete real-life behavior.

## 15. Work, Money and Direction

Explain work pattern, ambition, discipline, money/security behavior, and potential.

## 16. Past, Present and Possible Direction

Do NOT predict events.
Explain:
- what repeated in the past
- what is active now
- what direction opens if patterns shift

## 17. Final Message

End grounded, human, powerful.
No generic inspiration.

==================================================
QUALITY RULES
==================================================

Every section must include real-life behavior examples.

Do not repeat the same idea too many times.

Do not overfocus only on:
- fear
- vulnerability
- emotional withdrawal
- overthinking

Make the person feel multidimensional:
- work
- love
- social behavior
- thinking
- ambition
- creativity
- discipline
- emotional style
- public behavior
- private inner process

The user should repeatedly think:
"That is exactly what I do."

Avoid generic personality descriptions.

Minimum 2600 words.

Now write the complete final report.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.85,
    messages: [
      {
        role: "system",
        content:
          "You compose premium personal reports from structured analysis. You do not invent new systems; you transform structured data into a clear human-readable report.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}