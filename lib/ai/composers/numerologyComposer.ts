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
You are writing the NUMEROLOGY CHAPTER of a premium Life Blueprint report.

IMPORTANT:
You are NOT writing a generic numerology reading.
You are NOT explaining number meanings like a textbook.
You are NOT predicting the future.
You are NOT using mystical language.
You are NOT writing vague spiritual content.

You are translating numerology data into a grounded behavioral chapter about motivation, inner drive, decision rhythm and life pattern.

PRODUCT CONTEXT:
Life Blueprint is a premium behavioral intelligence report based on multiple symbolic systems.
The user should feel:
"This explains why I move through life the way I do."

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural, clear, direct and emotionally intelligent language.

USER DATA:
Full name: ${fullName || "Unknown"}
Date of birth: ${birthDate || "Unknown"}
Time of birth: ${birthTime || "Unknown"}
Place of birth: ${birthPlace || "Unknown"}

NUMEROLOGY STRUCTURED DATA:
${JSON.stringify(numerologyParsed, null, 2)}

TASK:
Write a premium Numerology chapter for the user's Life Blueprint report.

TARGET LENGTH:
800–1500 words.

STYLE:
- Premium
- Concrete
- Personal
- Behavioral
- Practical
- No mystical language
- No generic number descriptions
- No predictions
- No vague spiritual phrases
- No "maybe", "possibly", "tendency", "energy", "vibration", "destiny"
- Do not sound like a numerology website

MAIN GOAL:
Use numerology as a behavioral motivation system.
Explain how the user moves through life, what drives them, where they lose direction, and what type of internal rhythm they need to respect.

STRUCTURE:

# Numerology Pattern

Start with a short introduction:
Explain that this chapter does not define the person through numbers.
It shows the internal drive, decision rhythm and motivation pattern that often operates underneath visible behavior.

Then write these sections:

## 1. Core Inner Drive

Use Life Path data if available.
Explain:
- what internally moves this person
- what gives them a sense of aliveness
- what kind of life rhythm suits them
- what happens when they ignore their inner drive
- what kind of situations make them feel trapped or disconnected

Make it practical.

## 2. Expression And How The Person Shows Up

Use Expression Number data if available.
Explain:
- how the person naturally expresses themselves
- what they are trying to build, prove, create or experience
- how others experience their natural output
- where they may hold back their real expression
- what becomes frustrating when they cannot express this side

## 3. Motivation Pattern

Explain:
- what motivates this person more than they admit
- what kind of progress keeps them engaged
- what kills motivation
- why they may start strong and then lose interest
- what they need to continue long term

Avoid generic motivational language.

## 4. Decision Rhythm

Explain:
- how this person decides
- when they need time
- when they act impulsively
- what kind of decision creates regret
- what kind of decision creates relief
- how they know internally that something is wrong

Use concrete examples.

## 5. Self-Sabotage Through Numbers

Explain:
- how the same drive can become a trap
- where the user overuses their strongest pattern
- what they avoid because it conflicts with their inner rhythm
- how they create pressure for themselves
- what pattern must be balanced

This must feel honest and useful.

## 6. What This Number Pattern Needs

Explain:
- what kind of environment supports this person
- what kind of work rhythm fits
- what kind of relationships respect their pattern
- what kind of goals actually work for them
- what they should stop forcing

## 7. Numerology Recognition Moments

Add 8–12 short recognition moments.

Recognition moments are concrete observations like:
- "You lose motivation faster when you feel controlled than when something is difficult."
- "You can know that something is wrong before you can logically explain why."
- "When your life becomes too repetitive, your discipline starts to look like resistance."

Rules:
- Do not mention numerology in the recognition moments.
- Do not mention numbers unless necessary.
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
    max_tokens: 3200,
    messages: [
      {
        role: "system",
        content:
          "You are a senior behavioral analysis writer creating a premium numerology-based motivation chapter. You write concrete, grounded, non-generic text.",
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