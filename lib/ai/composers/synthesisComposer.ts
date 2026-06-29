import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type SynthesisComposerInput = {
  synthesisParsed: any;
  westernParsed?: any;
  jyotishParsed?: any;
  numerologyParsed?: any;
  chineseParsed?: any;
  language?: string;
  fullName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
};

export async function synthesisComposer({
  synthesisParsed,
  westernParsed,
  jyotishParsed,
  numerologyParsed,
  chineseParsed,
  language = "Croatian",
  fullName,
  birthDate,
  birthTime,
  birthPlace,
}: SynthesisComposerInput): Promise<string> {
  if (!synthesisParsed) {
    throw new Error("synthesisComposer: synthesisParsed is missing.");
  }

  const prompt = `
You are writing the FINAL SYNTHESIS CHAPTER of a premium Life Blueprint report.

This is the most important chapter.

IMPORTANT:
You are NOT writing astrology.
You are NOT writing numerology.
You are NOT writing a horoscope.
You are NOT explaining symbolic systems.
You are NOT predicting the future.
You are NOT using mystical language.

You are translating multi-system symbolic input into a deep behavioral intelligence synthesis.

PRODUCT CONTEXT:
Life Blueprint is a premium behavioral intelligence report based on multiple symbolic systems:
- Western astrology
- Jyotish
- Numerology
- Chinese zodiac

But the customer is not buying astrology.
The customer is buying the feeling:
"Finally, someone explained how I function."

MAIN GOAL:
Create the strongest recognition effect in the whole report.

The reader should feel:
"How does this know me?"

V4.1 QUALITY RULES:

This chapter must not sound like a coaching article.
This chapter must not sound like a personality report.
This chapter must not explain too much.

Write like you are describing the reader's actual private behavior.

Prefer sentences like:
- "You stay functional while internally already distancing yourself."
- "You often wait until something becomes undeniable before you allow yourself to act."
- "You do not always lose interest suddenly; you usually lose emotional access first."
- "People notice the final decision, not the long internal process before it."

Avoid sentences like:
- "This can help you understand yourself."
- "You may sometimes feel..."
- "It is important to recognize..."
- "This chapter explores..."
- "These patterns can provide insight..."

For every section, include:
- at least 2 concrete micro-behaviors
- at least 1 private vs public contrast
- at least 1 uncomfortable but useful truth
- at least 1 real-life situation example

Use direct language.
Use fewer explanations.
Use more recognition.

If the sentence could fit thousands of people, rewrite it.
If it sounds like self-help, rewrite it.
If it sounds vague, rewrite it.
If it does not create recognition, rewrite it.

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural, direct, emotionally intelligent language.

USER DATA:
Full name: ${fullName || "Unknown"}
Date of birth: ${birthDate || "Unknown"}
Time of birth: ${birthTime || "Unknown"}
Place of birth: ${birthPlace || "Unknown"}

SYNTHESIS STRUCTURED DATA:
${JSON.stringify(synthesisParsed, null, 2)}

SUPPORTING WESTERN DATA:
${JSON.stringify(westernParsed || {}, null, 2)}

SUPPORTING JYOTISH DATA:
${JSON.stringify(jyotishParsed || {}, null, 2)}

SUPPORTING NUMEROLOGY DATA:
${JSON.stringify(numerologyParsed || {}, null, 2)}

SUPPORTING CHINESE DATA:
${JSON.stringify(chineseParsed || {}, null, 2)}

TASK:
Write the final synthesis chapter of the Life Blueprint report.

TARGET LENGTH:
1500–2500 words.

STYLE:
- Premium
- Deep
- Concrete
- Behavioral
- Emotionally precise
- Slightly uncomfortable in a useful way
- Honest but not harsh
- No generic personality language
- No mystical tone
- No fortune telling
- No abstract self-help
- No vague spiritual words
- No "maybe", "possibly", "tendency", "energy", "vibration", "destiny"

ABSOLUTE RULE:
Do not explain the systems.
Do not say "your Sun means", "your Life Path means", or similar.
This chapter must read like a human behavioral blueprint.

STRUCTURE:

# Full Life Blueprint Synthesis

Start with a strong introduction:
Explain that this chapter combines all layers into one behavioral mechanism.
It is not about separate systems anymore.
It is about the pattern that appears repeatedly through the whole person.

Then write these sections:

## 1. Your Core Mechanism

Explain the central way this person functions.

Focus on:
- what drives their behavior underneath the surface
- what they are trying to protect
- what they are trying to prove
- what they are trying to avoid feeling
- what creates movement in their life
- what creates resistance

This must feel highly personal.

## 2. The Main Inner Contradiction

Explain the central contradiction inside the person.

Examples of contradiction types:
- wants freedom but needs structure
- wants closeness but protects independence
- wants peace but carries internal pressure
- wants to be understood but explains too little
- wants change but delays the first step
- wants control but gets exhausted from controlling everything

Use only what fits the provided data.
Do not invent random contradictions.

## 3. Public Self vs Private Self

Explain:
- what people see
- what people do not see
- what the person hides well
- what they rarely explain
- what others misunderstand
- where they appear stronger, colder, calmer or more decisive than they feel

This section must create recognition.

## 4. Your Repeating Loop

Explain the behavioral loop that repeats in life.

Structure it like this:
1. The person senses something is wrong.
2. They analyze or absorb it internally.
3. They delay direct expression or direct action.
4. Pressure builds.
5. They either withdraw, over-control, cut off, restart, overwork, or emotionally detach.
6. The outside world only sees the final reaction.

Adapt this loop to the actual data.

## 5. Trust Pattern

Explain:
- how trust is built
- how trust is tested
- how trust is lost
- what the person does before saying something is wrong
- what emotional access means for them
- what happens when someone disappoints them repeatedly

Make it concrete.

## 6. Decision Traps

Explain:
- what kind of decisions drain them
- when they overthink
- when they act too late
- when they act suddenly after long internal processing
- what causes regret
- what creates relief
- how they can make cleaner decisions

No generic advice.

## 7. Self-Sabotage Pattern

Explain:
- how the person blocks themselves
- what they postpone
- what they over-control
- what they under-communicate
- what they tolerate too long
- what they cut off too late or too silently
- where their strength becomes a trap

This section should feel honest and useful.

## 8. Hidden Strength

Explain the strength the person may underestimate.

Focus on:
- resilience
- pattern recognition
- emotional endurance
- strategic thinking
- ability to rebuild
- ability to see what others miss
- ability to carry complexity

Use only what fits the data.

## 9. What Changes Everything

Explain the few practical shifts that would change the person's life pattern.

Include:
- what to stop doing
- what to start doing
- what to say earlier
- what to stop tolerating
- what kind of environment supports them
- what kind of responsibility they must accept
- what kind of false responsibility they must release

This must be practical, not motivational.

## 10. Recognition Moments

Add 15–25 sharp recognition moments.

Recognition moments are short, concrete statements that feel like real life.

Examples:
- "You often decide internally before anyone knows you are even considering a change."
- "People may see control, but not the number of scenarios running in your head."
- "When trust drops, you usually reduce emotional access before you explain why."
- "You can stay functional while emotionally already being far away."
- "You sometimes wait for a situation to become undeniable before you allow yourself to act."
- "You may explain practical reasons while the real reason is that something inside you no longer feels safe."
- "You do not always ask for help when things are heavy; you first try to carry it quietly."

Rules:
- Do not mention astrology, numerology, Jyotish or Chinese zodiac.
- Do not mention planets, signs, houses or numbers.
- Make each one concrete.
- Avoid generic statements.
- They should sound like observations from real life.
- They should create the "how does this know me?" feeling.

## 11. Final Human Summary

End with a powerful, grounded summary.

Explain:
- the person is not broken
- their pattern has logic
- their life improves when they stop fighting their own mechanism
- the goal is not to become someone else
- the goal is to use their own structure consciously

No cheesy ending.
No motivational clichés.

OUTPUT RULES:
Return only the final chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not say "based on the data provided" too often.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.72,
    max_tokens: 4500,
    messages: [
      {
        role: "system",
        content:
          "You are a senior behavioral synthesis writer creating the most important chapter of a premium personal blueprint. You write concrete, emotionally precise, non-generic text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("synthesisComposer: OpenAI returned empty content.");
  }

  return text.trim();
}