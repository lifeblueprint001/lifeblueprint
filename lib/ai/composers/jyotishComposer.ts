import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type JyotishComposerInput = {
  jyotishParsed: any;
  language?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export async function jyotishComposer({
  jyotishParsed,
  language = "Croatian",
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: JyotishComposerInput): Promise<string> {
  if (!jyotishParsed) {
    throw new Error("jyotishComposer: jyotishParsed is missing.");
  }

  const prompt = `
You are writing the JYOTISH / VEDIC ASTROLOGY CHAPTER of a Life Blueprint report.

PRODUCT DEFINITION:
Life Blueprint is not a horoscope.
Life Blueprint is not fortune telling.
Life Blueprint is not therapy.
Life Blueprint is not spiritual entertainment.
Life Blueprint is not a personality test.

Life Blueprint is an impartial symbolic blueprint built from minimal objective input:
- full name
- birth date
- birth time
- birth place

This chapter uses Jyotish / Vedic astrology as one symbolic system.
The goal is not to convince the reader that Jyotish is absolute truth.
The goal is not to predict destiny.
The goal is not to use spiritual authority.

The goal is to translate the Jyotish configuration into a clear, grounded map of:
- life direction
- inner pressure
- maturity themes
- responsibility patterns
- repeated tensions
- relationship lessons
- work and contribution patterns
- self-observation points

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural Croatian, not Serbian phrasing.
Use clean, serious, precise language.

USER DATA:
Full name: ${fullName || "Unknown"}
Date of birth: ${birthDate || "Unknown"}
Time of birth: ${birthTime || "Unknown"}
Place of birth: ${birthPlace || "Unknown"}

JYOTISH STRUCTURED DATA:
${JSON.stringify(jyotishParsed, null, 2)}

CORE WRITING PRINCIPLE:
Jyotish is used here as a symbolic system of life patterning.
The report must not sound fatalistic.
The report must not sound religious.
The report must not sound mystical.
The report must not sound like spiritual coaching.

Symbols are the foundation.
The report is the translation.

Use the Jyotish data seriously, but translate it into:
- life themes
- pressure points
- maturity patterns
- responsibility and resistance
- emotional learning
- relational dynamics
- work and service direction
- repeating inner lessons
- practical self-observation

IMPORTANT ETHICAL RULES:
- Do not invent biography.
- Do not invent trauma.
- Do not invent relationship history.
- Do not invent job, family, divorce, childhood, health or life events.
- Do not diagnose.
- Do not predict the future.
- Do not say what will happen.
- Do not present Jyotish as scientific proof.
- Do not present Jyotish as spiritual authority.
- Do not flatter.
- Do not scare.
- Do not use fatalistic karma language.
- Do not say the person is punished by karma.
- Do not say something is destined.
- Do not create dependency on future readings.
- Do not write generic AI self-help content.

STYLE RULES:
Avoid:
- "Your destiny..."
- "Your karma forces you..."
- "The universe..."
- "Your soul chose..."
- "You are meant to..."
- "This chapter explores..."
- "This can help you understand..."
- "It is important to recognize..."
- repeated soft phrases like "možeš" in every sentence
- exaggerated certainty
- vague spiritual labels
- motivational coaching tone

Prefer:
- "This Jyotish layer points toward..."
- "Symbolically, this suggests..."
- "In real life, this can often show up as..."
- "This should be read as a pattern, not a fixed fate."
- "If this pattern is active, it may be visible through..."
- concrete life expressions
- pressure and maturity language
- direct but fair interpretation
- clear separation between strong themes and secondary nuances

QUALITY BAR:
If a sentence could fit almost anyone, rewrite it.
If it sounds like spiritual coaching, rewrite it.
If it sounds fatalistic, rewrite it.
If it sounds like therapy, rewrite it.
If it sounds like motivational content, rewrite it.
If it claims too much certainty, rewrite it.
If it does not translate a symbol into real life expression, rewrite it.

TASK:
Write the Jyotish / Vedic Astrology chapter of the Life Blueprint report.

TARGET LENGTH:
1100–1900 words.

STRUCTURE:

# Jyotish Life Direction

Start with a short introduction.
Explain that this chapter uses Jyotish as a symbolic layer of life direction, pressure and maturity.
Clarify that this is not prediction, fate or spiritual authority.
Keep it short and serious.

## 1. Main Jyotish Indicators

Briefly name the most important Jyotish indicators from the structured data.

Use only the indicators that are actually available.

Possible indicators may include:
- Lagna / Ascendant
- Moon / Rashi
- Sun
- Nakshatra if available
- Saturn
- Jupiter
- Rahu and Ketu
- house themes
- dharma, artha, kama, moksha emphasis if available
- major life-direction indicators

For each important indicator, write one clear sentence:
- what the indicator generally represents
- what this specific placement symbolically points toward

Do not overwhelm the reader.
This section should orient them, not teach Jyotish theory.

## 2. Deeper Life Theme

Identify the main life-direction pattern shown by this Jyotish layer.

Explain:
- what theme appears central
- what kind of pressure or direction it creates
- what the person may repeatedly need to mature through
- what becomes difficult when this theme is resisted
- what becomes clearer when this theme is handled consciously

Do not predict events.
Translate the symbolic theme into life pattern.

## 3. Inner Pressure and Growth Tension

Describe the main inner tension.

Possible examples:
- duty vs personal desire
- stability vs movement
- independence vs belonging
- service vs self-respect
- control vs surrender
- ambition vs emotional balance
- discipline vs resistance

Use only what is supported by the data.

Explain how this tension may show up in real life:
- delayed decisions
- taking on too much
- resisting what one already knows must be done
- appearing calm while carrying pressure privately
- needing proof before acting

## 4. Emotional Maturity Pattern

Describe the emotional maturation pattern.

Focus on:
- how emotional pressure is processed
- what may be protected or hidden
- where emotional reactions become stronger than expected
- what kind of situations demand more maturity
- where the person may need to speak earlier instead of carrying things silently

Do not claim trauma.
Do not invent past emotional events.

## 5. Duty, Responsibility and Resistance

Describe the responsibility pattern.

Explain:
- what type of responsibility may feel natural
- what type may feel heavy
- where discipline supports the person
- where responsibility becomes quiet resentment
- where resistance appears when the person feels trapped
- how structure can help without becoming a prison

Keep this grounded and practical.

## 6. Relationships and Trust Lessons

Describe relationship themes through Jyotish symbolism.

Focus on:
- trust
- emotional access
- loyalty
- expectation
- withdrawal
- boundaries
- giving too much or withholding too long
- what kind of communication prevents unnecessary distance

Do not write romantic clichés.
Do not invent relationship history.

## 7. Work, Service and Direction

Explain the work and contribution pattern.

Focus on:
- what kind of contribution may feel meaningful
- how the person relates to useful work
- where they need structure
- where they need autonomy
- where they may feel underused
- how pressure builds when effort has no meaning
- what kind of role may support maturity

Do not invent the actual job.

## 8. Repeating Life Lesson

Describe the repeating symbolic lesson shown by this Jyotish layer.

This should not sound like fate.
It should sound like a pattern the reader can observe.

Explain:
- what keeps repeating as a theme
- what the person may be asked to balance
- what happens when the pattern is ignored
- what becomes possible when the pattern is seen clearly

## 9. Strong Jyotish Themes vs Secondary Nuances

Create two short subsections.

### Strong Jyotish Themes
List 4–6 themes that are strongly visible in the Jyotish data.
For each:
- name the theme
- mention the general indicators supporting it
- translate it into real-life behavior

### Secondary Nuances
List 3–5 themes that are present but should not dominate the interpretation.
For each:
- explain why it is a nuance
- how it may show up situationally

This section is important because Life Blueprint must not treat every symbol as equally certain.

## 10. Jyotish Recognition Points

Write 8–12 concrete recognition points.

Rules:
- No predictions.
- No biography.
- No therapy language.
- No mystical language.
- No fatalistic karma language.
- No signs, houses or technical Jyotish terms in this section.
- Each point must be concrete enough that the reader can compare it with real life.

Good style:
- "You may carry responsibility quietly and only later realize how heavy it became."
- "You may resist a decision not because you do not know the answer, but because the answer changes your structure."
- "You may stay functional while internally already distancing yourself from something."
- "When effort loses meaning, discipline can turn into silent resistance."

Bad style:
- "You are karmically destined..."
- "Your soul must learn..."
- "You are spiritual."
- "You are emotional."
- "Everything happens for a reason."

## 11. Jyotish Chapter Summary

End with a grounded summary.

Say:
- this is only the Jyotish layer
- it is not the whole Life Blueprint
- it does not define fate
- its value is in the themes the reader can verify
- the final synthesis will compare this layer with the other systems

No mystical ending.
No exaggerated promise.
No motivational speech.

OUTPUT RULES:
Return only the Jyotish chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not mention that you are an AI.
Do not apologize.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.68,
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content:
          "You are a serious symbolic interpretation writer for Life Blueprint. You translate Jyotish into impartial life-direction and maturity patterns without prediction, fatalism, flattery, fear, diagnosis, biography invention, or mystical authority.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("jyotishComposer: OpenAI returned empty content.");
  }

  return text.trim();
}