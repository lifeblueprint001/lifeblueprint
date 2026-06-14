import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type WesternComposerInput = {
  westernParsed: any;
  language?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export async function westernComposer({
  westernParsed,
  language = "Croatian",
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: WesternComposerInput): Promise<string> {
  if (!westernParsed) {
    throw new Error("westernComposer: westernParsed is missing.");
  }

  const prompt = `
You are writing the WESTERN ASTROLOGY CHAPTER of a premium Life Blueprint report.

IMPORTANT:
You are NOT writing a horoscope.
You are NOT writing mystical astrology content.
You are NOT predicting the future.
You are NOT explaining astrology theory.

You are translating Western astrology data into a deep behavioral intelligence chapter.

PRODUCT CONTEXT:
Life Blueprint is a premium behavioral report based on multiple symbolic systems.
The user should feel:
"This is not a horoscope. This is a book about how I function."

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural, clear, emotionally intelligent language.

USER DATA:
Full name: ${fullName || "Unknown"}
Date of birth: ${birthDate || "Unknown"}
Time of birth: ${birthTime || "Unknown"}
Place of birth: ${birthPlace || "Unknown"}

WESTERN ASTROLOGY STRUCTURED DATA:
${JSON.stringify(westernParsed, null, 2)}

TASK:
Write a long premium chapter about the user's Western Astrology Blueprint.

TARGET LENGTH:
1500–2500 words.

STYLE:
- Premium
- Personal
- Concrete
- Behavioral
- Deep
- Direct
- Human
- No generic astrology phrases
- No fortune telling
- No vague spiritual language
- No "maybe", "possibly", "tendency", "energy", "vibration", "destiny"
- Do not sound like TikTok astrology
- Do not sound like a textbook
- Do not over-explain signs, planets or houses

MAIN GOAL:
Create recognition.
The reader must feel:
"How does this know me?"

STRUCTURE:

# Western Astrology Blueprint

Start with a short introduction explaining that this chapter does not describe personality in a generic way, but the visible and invisible behavioral architecture shown through the Western chart.

Then write these sections:

## 1. How People Experience You First

Use Ascendant data if available.
Explain:
- first impression
- social mask
- how others read the user before they know them
- what the user may not realize they project
- the difference between outer behavior and inner reality

Include concrete real-life examples.

## 2. Core Identity And Inner Direction

Use Sun data if available.
Explain:
- identity pattern
- what gives the person a sense of self
- what they need to respect in themselves
- where they become weaker when they betray themselves
- how they behave when they are aligned vs. misaligned

Do not explain the Sun sign theoretically.
Translate it into behavior.

## 3. Emotional Pattern And Private Reactions

Use Moon data if available.
Explain:
- emotional needs
- private reactions
- what hurts more than the person admits
- how they protect themselves emotionally
- what they do when overwhelmed
- what others often misunderstand

Include micro behaviors.

## 4. Mind, Communication And Decision Logic

Use Mercury data if available.
Explain:
- how the mind works
- how the user processes information
- how they speak when calm
- how they speak under pressure
- decision traps
- overthinking patterns
- what type of communication drains them

Make this practical.

## 5. Love, Attachment And Trust

Use Venus data if available.
Explain:
- how the user bonds
- what they need to feel safe
- what makes them withdraw
- what they secretly test in people
- what they give too much of
- what they stop giving when trust is damaged

No romantic clichés.
Make it psychologically real.

## 6. Drive, Anger And Action Pattern

Use Mars data if available.
Explain:
- how the user takes action
- how they handle anger
- how they compete
- what motivates them
- what blocks movement
- how frustration shows up
- what they do instead of directly confronting something

Include real behavior examples.

## 7. Growth, Confidence And Opportunity Pattern

Use Jupiter data if available.
Explain:
- where the person expands
- where confidence grows
- what type of environment helps them
- where they may overdo things
- what kind of opportunity fits them naturally

Avoid exaggerated positivity.
Keep it grounded.

## 8. Fear, Pressure And Self-Discipline

Use Saturn data if available.
Explain:
- pressure points
- fear patterns
- where the user feels tested
- what they avoid because it feels heavy
- where maturity is built
- what becomes a strength through discipline

This section should feel serious and useful.

## 9. Work Direction And Public Role

Use Midheaven data if available.
Explain:
- public direction
- career behavior
- how the person wants to be respected
- what kind of work identity fits
- what kind of authority they resist
- how they behave when they feel they are wasting potential

## 10. Western System Synthesis

Create a deep synthesis of the Western chart.
Do not repeat previous sections.

Explain:
- the main behavioral contradiction
- the difference between public self and private self
- the repeating life pattern
- the self-sabotage pattern
- the hidden strength
- the kind of life situation that activates the best version of this person

Add 8-12 "Recognition Moments".

Recognition moments are short, sharp observations like:
- "You often decide internally before anyone knows you have already changed direction."
- "People may see control, but not the amount of scenarios running in your head."
- "When trust drops, you usually reduce emotional access before you explain why."

Rules for Recognition Moments:
- They must be concrete.
- They must not be generic.
- They must sound like real life.
- They must not mention astrology.

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
    max_tokens: 4500,
    messages: [
      {
        role: "system",
        content:
          "You are a senior behavioral analysis writer creating a premium personal report chapter. You write concrete, emotionally intelligent, non-generic text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("westernComposer: OpenAI returned empty content.");
  }

  return text.trim();
}