import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type NumerologyComposerInput = {
  numerologyParsed: any;
  language?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export async function numerologyComposer({
  numerologyParsed,
  language = "Croatian",
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: NumerologyComposerInput): Promise<string> {
  if (!numerologyParsed) {
    throw new Error("numerologyComposer: numerologyParsed is missing.");
  }

  const prompt = `
You are writing the NUMEROLOGY CHAPTER of a Life Blueprint report.

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

This chapter uses numerology as one symbolic system.
The goal is not to convince the reader that numerology is absolute truth.
The goal is not to define the person by numbers.
The goal is not to flatter, scare or create mystical meaning.

The goal is to translate the numerological pattern into a clear, grounded map of:
- inner motivation
- expression style
- decision rhythm
- pressure between numbers
- self-sabotage risks
- personal rhythm
- practical self-observation

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

NUMEROLOGY STRUCTURED DATA:
${JSON.stringify(numerologyParsed, null, 2)}

CORE WRITING PRINCIPLE:
Numerology is used here as a symbolic system of rhythm, motivation and expression.
The report must not sound mystical.
The report must not sound like a number is a fixed identity.
The report must not sound like motivational coaching.

Symbols are the foundation.
The report is the translation.

Use the numerology data seriously, but translate it into:
- motivation
- inner drive
- expression
- decision style
- conflict between needs
- self-sabotage pattern
- work rhythm
- relationship rhythm
- practical recognition points

IMPORTANT ETHICAL RULES:
- Do not invent biography.
- Do not invent trauma.
- Do not invent relationship history.
- Do not invent job, family, divorce, childhood, health or life events.
- Do not diagnose.
- Do not predict the future.
- Do not say what will happen.
- Do not present numerology as scientific proof.
- Do not flatter.
- Do not scare.
- Do not use mystical language.
- Do not say numbers control the person.
- Do not create dependency on future readings.
- Do not write generic AI self-help content.

STYLE RULES:
Avoid:
- "Your destiny number means..."
- "You are meant to..."
- "The universe..."
- "Your energy..."
- "Your vibration..."
- "Your soul..."
- "This chapter explores..."
- "This can help you understand..."
- "It is important to recognize..."
- repeated soft phrases like "možeš" in every sentence
- vague motivational language
- exaggerated certainty
- generic descriptions of numbers

Prefer:
- "This numerological layer points toward..."
- "Symbolically, this number pattern suggests..."
- "In behavior, this can often show up as..."
- "This should be read as a rhythm, not a fixed identity."
- "If this pattern is active, it may be visible through..."
- concrete examples
- inner rhythm language
- motivation and pressure language
- clear difference between strong themes and weaker nuances

QUALITY BAR:
If a sentence could fit almost anyone, rewrite it.
If it sounds like mystical numerology, rewrite it.
If it sounds like therapy, rewrite it.
If it sounds like motivational content, rewrite it.
If it claims too much certainty, rewrite it.
If it does not translate a number into real behavior, rewrite it.

TASK:
Write the Numerology chapter of the Life Blueprint report.

TARGET LENGTH:
900–1600 words.

STRUCTURE:

# Numerology Pattern

Start with a short introduction.
Explain that this chapter uses numerology as a symbolic layer of rhythm, motivation and expression.
Clarify that numbers do not define the person and this is not prediction or absolute truth.
Keep it short and serious.

## 1. Main Numerology Indicators

Briefly name the most important numerology indicators from the structured data.

Use only indicators that are actually available.

Possible indicators may include:
- Life Path
- Expression
- Soul Urge
- Personality
- Birthday Number
- Maturity Number
- relationship between name and birth date
- tension between main numbers

For each important indicator, write one clear sentence:
- what the indicator generally represents
- what this specific number symbolically points toward

Do not overwhelm the reader.
This section should orient them, not teach numerology theory.

## 2. Core Inner Drive

Describe the main inner motivation shown by the numerological layer.

Explain:
- what the person is internally pulled toward
- what kind of movement, stability, expression, structure or meaning this pattern seeks
- what creates energy
- what drains energy
- what the person may repeatedly try to experience, prove, create or escape

Do not define the person absolutely.
Translate the pattern.

## 3. Expression Style

Describe how the person may express themselves.

Focus on:
- communication style
- creativity or practicality if supported
- social expression
- how others may experience this expression
- where the person may hold back
- where expression becomes too scattered, controlled, intense or inconsistent

Use concrete examples.

## 4. Decision Rhythm

Describe the decision pattern from the numbers.

Explain:
- what kind of decisions feel natural
- what kind of decisions create pressure
- where the person may move too fast
- where they may delay
- what creates regret
- what creates relief
- what helps them make cleaner decisions

Avoid generic advice.

## 5. Inner Conflict Between Numbers

If the structured data shows more than one main number, describe the tension between them.

Possible tensions:
- freedom vs responsibility
- expression vs discipline
- movement vs stability
- independence vs belonging
- creativity vs practicality
- sensitivity vs external performance

Explain:
- why both sides matter
- how the tension may show up in everyday life
- what happens when one side dominates too long

If the data does not support a strong conflict, say the numerology layer shows a simpler rhythm.

## 6. Self-Sabotage Through the Numerology Pattern

Explain where strengths become traps.

Include:
- where freedom becomes avoidance
- where responsibility becomes burden
- where creativity becomes scattered energy
- where analysis becomes delay
- where expression becomes performance
- where independence becomes isolation
- where flexibility becomes lack of direction

Use only what is supported by the numbers.

Make this honest but not insulting.

## 7. Work, Focus and Life Rhythm

Explain what kind of rhythm supports the person.

Focus on:
- work rhythm
- motivation rhythm
- need for structure or freedom
- what happens in monotony
- what happens in chaos
- how the person can stay consistent without feeling trapped
- what type of contribution may feel meaningful

Do not invent the actual job.

## 8. Relationships and Personal Rhythm

Explain how the numerology pattern may affect relationships.

Focus on:
- need for space or closeness
- communication rhythm
- expectations
- emotional availability
- consistency
- what the person gives
- what they may quietly need back

Do not write romantic clichés.
Do not invent relationship history.

## 9. Strong Numerology Themes vs Secondary Nuances

Create two short subsections.

### Strong Numerology Themes
List 3–5 themes that are strongly visible in the numerology data.
For each:
- name the theme
- mention the general indicator supporting it
- translate it into real-life behavior

### Secondary Nuances
List 2–4 themes that are present but should not dominate the interpretation.
For each:
- explain why it is a nuance
- how it may show up situationally

This is important because Life Blueprint must not treat every number as equally central.

## 10. Numerology Recognition Points

Write 8–12 concrete recognition points.

Rules:
- No predictions.
- No biography.
- No therapy language.
- No mystical language.
- No number names in this section.
- Each point must be concrete enough that the reader can compare it with real life.

Good style:
- "You may lose motivation faster when something feels repetitive than when something is genuinely difficult."
- "You may need movement and options, but too many open options can scatter your direction."
- "You may start with strong energy and then struggle when the work becomes maintenance."
- "You may resist structure until you see that structure can protect your freedom instead of killing it."

Bad style:
- "You are free-spirited."
- "You are creative."
- "You are destined for success."
- "Your number gives you powerful energy."
- "You need to follow your heart."

## 11. Numerology Chapter Summary

End with a grounded summary.

Say:
- this is only the numerology layer
- it is not the whole Life Blueprint
- it does not define the person
- its value is in the rhythms the reader can verify
- the final synthesis will compare this layer with the other systems

No mystical ending.
No exaggerated promise.
No motivational speech.

OUTPUT RULES:
Return only the Numerology chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not mention that you are an AI.
Do not apologize.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.68,
    max_tokens: 3600,
    messages: [
      {
        role: "system",
        content:
          "You are a serious symbolic interpretation writer for Life Blueprint. You translate numerology into impartial rhythm, motivation and expression patterns without prediction, flattery, fear, diagnosis, biography invention, or mystical language.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("numerologyComposer: OpenAI returned empty content.");
  }

  return text.trim();
}