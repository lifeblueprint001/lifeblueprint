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

Write in Croatian if the birth place suggests Croatia, Serbia, Bosnia and Herzegovina, Montenegro, Slovenia, North Macedonia or nearby Balkan region.
Otherwise write in English.

Use only one language.
In Croatian, use "ti", never "Vi".

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
REPORT STRUCTURE
==================================================

Use this exact structure:

# LIFE BLUEPRINT
## Personal Life Pattern Analysis

Name:
Birth date:
Birth time:
Birth place:

## 1. Kako čitati ovaj report

Explain briefly that this is a multi-system behavioral analysis, not fortune telling.

## 2. Zapadna astrologija: tvoja osnovna psihološka mapa

Explain the western astrology layer through real behavior:
- identity
- communication
- relationships
- work mentality
- emotions
- conflict
- hidden strength

## 3. Numerologija: tvoj unutarnji pogon

Explain:
- life path
- expression pattern
- motivation
- adaptability
- creativity
- discipline
- hidden challenge

## 4. Đotiš smjer: dublji životni obrazac

Explain:
- life direction
- karmic/repeating pattern
- inner conflict
- relationship lesson
- work and duty
- present challenge
- future direction without prediction

## 5. Kineski horoskop: instinkt i ponašanje među ljudima

Explain:
- instinctive style
- public personality
- adaptability
- emotional defense
- social strengths
- shadow pattern

## 6. Glavna sinteza: obrazac koji se ponavlja kroz tvoj život

This is the most important section.
Use synthesis strongly.
Explain:
- core pattern
- main contradiction
- present tension
- emotional defense
- self-sabotage
- hidden strength

## 7. Odnosi i bliskost

Explain relationship dynamic in concrete real-life behavior.

## 8. Posao, novac i smjer

Explain work pattern, ambition, discipline, money/security behavior, and potential.

## 9. Prošlost, sadašnjost i mogući smjer

Do NOT predict events.
Explain:
- what repeated in the past
- what is active now
- what direction opens if patterns shift

## 10. Završna poruka

End grounded, human, powerful.
No generic inspiration.

==================================================
QUALITY RULES
==================================================

Every section must include real-life behavior examples.
Do not repeat the same idea too many times.
Do not overfocus only on fear, vulnerability or emotional withdrawal.
Make the person feel multidimensional:
- work
- love
- social behavior
- thinking
- ambition
- creativity
- discipline
- emotional style

Minimum 2200 words.
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