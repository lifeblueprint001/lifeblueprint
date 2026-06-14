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
You are writing the JYOTISH / VEDIC ASTROLOGY CHAPTER of a premium Life Blueprint report.

IMPORTANT:
You are NOT writing a mystical Vedic astrology reading.
You are NOT predicting fate.
You are NOT using spiritual clichés.
You are NOT writing about karma in a vague or religious way.
You are NOT explaining Jyotish theory.

You are translating Jyotish data into a grounded life-pattern and behavioral-direction chapter.

PRODUCT CONTEXT:
Life Blueprint is a premium behavioral intelligence report based on multiple symbolic systems.
The user should feel:
"This is not a horoscope. This explains the deeper pattern behind my life choices."

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural, clear, serious and emotionally intelligent language.

USER DATA:
Full name: ${fullName || "Unknown"}
Date of birth: ${birthDate || "Unknown"}
Time of birth: ${birthTime || "Unknown"}
Place of birth: ${birthPlace || "Unknown"}

JYOTISH STRUCTURED DATA:
${JSON.stringify(jyotishParsed, null, 2)}

TASK:
Write a premium Jyotish chapter for the user's Life Blueprint report.

TARGET LENGTH:
1000–2000 words.

STYLE:
- Premium
- Grounded
- Deep
- Behavioral
- Serious
- Mature
- No mystical language
- No predictions
- No religious tone
- No "karma" unless explained as repeating behavioral consequence
- No vague spiritual phrases
- No generic Vedic astrology descriptions
- No "maybe", "possibly", "tendency", "energy", "vibration", "destiny"

MAIN GOAL:
Use Jyotish as a life-direction system.
The chapter should explain:
- the deeper life lesson
- the repeating internal conflict
- the growth path
- the pressure points
- the difference between what the person wants and what life repeatedly forces them to develop

STRUCTURE:

# Jyotish Life Direction

Start with a short introduction:
Explain that this chapter does not predict the future.
It describes the deeper life-direction pattern, inner lessons and recurring psychological pressure shown through the Jyotish layer.

Then write these sections:

## 1. The Deeper Life Theme

Explain:
- what kind of inner development this person repeatedly faces
- what life keeps asking them to mature into
- what pattern they cannot avoid forever
- what becomes easier when they stop resisting their own direction

Keep this practical and psychological.

## 2. Inner Conflict And Growth Pressure

Explain:
- the main internal tension
- what the person wants versus what they actually need to develop
- where they may feel pulled in two directions
- where they repeat the same emotional or practical lesson
- what type of pressure creates growth

Avoid dramatic language.

## 3. Emotional Maturity Pattern

Explain:
- how emotional maturity develops for this person
- what emotional reactions must become more conscious
- where they protect themselves too strongly
- where they must learn patience, boundaries or courage
- what emotional behavior creates unnecessary complications

Use real-life examples.

## 4. Duty, Responsibility And Resistance

Explain:
- where the person feels responsibility
- what they resist because it feels heavy
- what they postpone
- what they know internally but delay acting on
- what kind of discipline changes their life

This section should feel honest, not motivational.

## 5. Relationship Lessons

Explain:
- what relationships teach this person
- what kind of dynamic repeats
- how they test trust
- what they tolerate too long
- what they cut off too silently
- what they must learn about attachment, loyalty and self-respect

No romantic clichés.

## 6. Work, Service And Direction

Explain:
- what type of work direction fits the deeper pattern
- how the person is meant to become useful
- what kind of role develops confidence
- where they must stop wasting potential
- what type of contribution feels meaningful

Keep it grounded and practical.

## 7. The Repeating Life Lesson

Write the clearest synthesis of this Jyotish layer.

Explain:
- the main repeating lesson
- the unconscious loop
- the behavior that keeps creating the same result
- the behavior that breaks the loop
- what this person becomes when they accept the lesson

## 8. Jyotish Recognition Moments

Add 8–12 short recognition moments.

Recognition moments are concrete observations like:
- "You often know what must change long before you are ready to act on it."
- "You can carry responsibility silently and then feel unseen because nobody realized how much you were carrying."
- "You do not always leave situations when they become wrong; first you detach internally."

Rules:
- Do not mention Jyotish in the recognition moments.
- Do not mention planets unless necessary.
- Make them concrete.
- Make them feel like real life.
- Avoid generic statements.

OUTPUT RULES:
Return only the final chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not say "based on the data provided" too often.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.75,
    max_tokens: 3800,
    messages: [
      {
        role: "system",
        content:
          "You are a senior behavioral analysis writer creating a premium Jyotish-based life direction chapter. You write grounded, concrete, non-mystical text.",
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