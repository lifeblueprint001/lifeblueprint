import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChineseComposerInput = {
  chineseParsed: any;
  language?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export async function chineseComposer({
  chineseParsed,
  language = "Croatian",
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: ChineseComposerInput): Promise<string> {
  if (!chineseParsed) {
    throw new Error("chineseComposer: chineseParsed is missing.");
  }

  const prompt = `
You are writing the CHINESE ZODIAC CHAPTER of a premium Life Blueprint report.

IMPORTANT:
You are NOT writing a generic Chinese horoscope.
You are NOT explaining animal signs like a textbook.
You are NOT predicting luck, wealth, love, or future events.
You are NOT using mystical language.

You are translating Chinese zodiac data into a grounded behavioral chapter about social instinct, adaptation, emotional defense and how the person moves through human environments.

PRODUCT CONTEXT:
Life Blueprint is a premium behavioral intelligence report based on multiple symbolic systems.
The user should feel:
"This explains how I behave around people, pressure and changing environments."

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural, clear, emotionally intelligent language.

USER DATA:
Full name: ${fullName || "Unknown"}
Date of birth: ${birthDate || "Unknown"}
Time of birth: ${birthTime || "Unknown"}
Place of birth: ${birthPlace || "Unknown"}

CHINESE ZODIAC STRUCTURED DATA:
${JSON.stringify(chineseParsed, null, 2)}

TASK:
Write a premium Chinese Zodiac chapter for the user's Life Blueprint report.

TARGET LENGTH:
800–1500 words.

STYLE:
- Premium
- Concrete
- Behavioral
- Socially intelligent
- Practical
- No mystical language
- No generic animal-sign descriptions
- No predictions
- No vague spiritual phrases
- No "maybe", "possibly", "tendency", "energy", "vibration", "destiny"
- Do not sound like a horoscope website

MAIN GOAL:
Use the Chinese zodiac layer as a social-instinct and adaptation system.
Explain how the user behaves in groups, pressure, trust situations, conflict and changing circumstances.

STRUCTURE:

# Chinese Zodiac Behavioral Style

Start with a short introduction:
Explain that this chapter does not describe luck or future events.
It describes social instinct, adaptation style and the behavioral mask the person may use in everyday life.

Then write these sections:

## 1. Social Instinct

Explain:
- how this person reads people
- how they behave in groups
- what they notice socially before others do
- how they protect their position
- when they become open versus guarded

Use real-life examples.

## 2. Adaptation Style

Explain:
- how the person adapts to changing situations
- whether they adjust quickly or resist at first
- what kind of environment makes them more natural
- what kind of environment makes them defensive
- how they behave when they do not feel in control

Make it practical.

## 3. Emotional Defense

Explain:
- how the user protects themselves emotionally
- what they show instead of what they feel
- how they avoid looking vulnerable
- what they do when disappointed
- how they behave when trust becomes uncertain

This should feel psychologically real.

## 4. Conflict And Social Pressure

Explain:
- how they respond to pressure from people
- how they handle criticism
- how they behave when they feel disrespected
- whether they confront, withdraw, observe, test or become colder
- what others may misread in them

No clichés.

## 5. Loyalty, Trust And Boundaries

Explain:
- what loyalty means to this person behaviorally
- how they decide who gets access to them
- what makes them close the door internally
- how they test reliability
- what kind of people they stop trusting

## 6. Strengths In Human Environments

Explain:
- what this person is naturally good at socially
- how they can influence without forcing
- what kind of role they can play in a group
- what people may rely on them for
- what strength they underestimate

## 7. Social Self-Sabotage

Explain:
- where this person creates unnecessary distance
- where they hide too much
- where they expect others to understand without explaining
- how they may protect themselves so well that nobody can reach them
- what pattern they should soften

## 8. Chinese Zodiac Recognition Moments

Add 8–12 short recognition moments.

Recognition moments are concrete observations like:
- "You can become polite instead of honest when you have already started to withdraw."
- "You often observe people longer than they realize before you decide how much access they get."
- "When you feel disrespected, your warmth can disappear before your words change."

Rules:
- Do not mention Chinese zodiac in the recognition moments.
- Do not mention animal signs unless necessary.
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
          "You are a senior behavioral analysis writer creating a premium Chinese-zodiac-based social behavior chapter. You write concrete, grounded, non-generic text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("chineseComposer: OpenAI returned empty content.");
  }

  return text.trim();
}