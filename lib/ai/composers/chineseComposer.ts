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
You are writing the CHINESE ZODIAC CHAPTER of a Life Blueprint report.

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

This chapter uses the Chinese zodiac as one symbolic system.
The goal is not to convince the reader that the Chinese zodiac is absolute truth.
The goal is not to describe luck, destiny or future events.
The goal is not to flatter the reader with animal-sign stereotypes.

The goal is to translate the Chinese zodiac pattern into a clear, grounded map of:
- social instinct
- adaptation style
- reaction to pressure
- relationship to change
- relationship to risk
- strategy
- group behavior
- emotional defense
- boundaries and trust
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

CHINESE ZODIAC STRUCTURED DATA:
${JSON.stringify(chineseParsed, null, 2)}

CORE WRITING PRINCIPLE:
The Chinese zodiac is used here as a symbolic system of social style, adaptation and strategy.
The report must not sound mystical.
The report must not sound like entertainment astrology.
The report must not reduce the person to an animal sign.
The report must not sound like motivational coaching.

Symbols are the foundation.
The report is the translation.

Use the Chinese zodiac data seriously, but translate it into:
- social behavior
- adaptation under pressure
- instinctive strategy
- risk style
- conflict response
- group dynamics
- loyalty and trust
- boundaries
- relationship to change
- practical recognition points

IMPORTANT ETHICAL RULES:
- Do not invent biography.
- Do not invent trauma.
- Do not invent relationship history.
- Do not invent job, family, divorce, childhood, health or life events.
- Do not diagnose.
- Do not predict the future.
- Do not say what will happen.
- Do not present Chinese zodiac as scientific proof.
- Do not flatter.
- Do not scare.
- Do not use mystical language.
- Do not write about luck, fortune, destiny or fate.
- Do not say the animal sign controls the person.
- Do not create dependency on future readings.
- Do not write generic AI self-help content.

STYLE RULES:
Avoid:
- "Your destiny..."
- "Your luck..."
- "The universe..."
- "Your energy..."
- "Your vibration..."
- "You are meant to..."
- "As a Monkey, you are..."
- "This chapter explores..."
- "This can help you understand..."
- "It is important to recognize..."
- repeated soft phrases like "možeš" in every sentence
- generic animal-sign descriptions
- exaggerated certainty
- motivational language

Prefer:
- "This Chinese zodiac layer points toward..."
- "Symbolically, this pattern suggests..."
- "In social behavior, this can often show up as..."
- "This should be read as a style, not a fixed identity."
- "If this pattern is active, it may be visible through..."
- concrete examples
- social instinct language
- adaptation and pressure language
- risk and strategy language
- clear difference between strong themes and weaker nuances

QUALITY BAR:
If a sentence could fit almost anyone, rewrite it.
If it sounds like a generic zodiac website, rewrite it.
If it sounds mystical, rewrite it.
If it sounds like therapy, rewrite it.
If it sounds like motivational content, rewrite it.
If it claims too much certainty, rewrite it.
If it does not translate the symbol into real behavior, rewrite it.

TASK:
Write the Chinese Zodiac chapter of the Life Blueprint report.

TARGET LENGTH:
800–1400 words.

STRUCTURE:

# Chinese Zodiac Behavioral Style

Start with a short introduction.
Explain that this chapter uses the Chinese zodiac as a symbolic layer of social instinct, adaptation and strategy.
Clarify that this is not luck, fate, prediction or fixed identity.
Keep it short and serious.

## 1. Main Chinese Zodiac Indicators

Briefly name the most important Chinese zodiac indicators from the structured data.

Use only indicators that are actually available.

Possible indicators may include:
- animal sign
- element
- yin / yang principle
- natural behavioral style
- social instinct
- adaptation style
- risk style
- response to pressure

For each important indicator, write one clear sentence:
- what the indicator generally represents
- what this specific indicator symbolically points toward

Do not overwhelm the reader.
This section should orient them, not teach Chinese zodiac theory.

## 2. Social Instinct

Describe the social instinct shown by this layer.

Focus on:
- how the person may read social situations
- how they adapt to people
- what kind of group role they may naturally take
- how they use observation, humor, distance, strategy or quick reaction
- what others may notice first
- what others may misunderstand

Use concrete examples.

## 3. Adaptation Style

Explain how the person may respond to change.

Include:
- what kind of change activates them
- what kind of change irritates or drains them
- where flexibility is a strength
- where flexibility becomes lack of direction
- how they behave when they need to adjust quickly

Do not write generic adaptability praise.

## 4. Pressure and Conflict Response

Describe how this layer reacts under pressure.

Focus on:
- what happens when the person feels cornered
- whether they become silent, sharp, strategic, humorous, restless or withdrawn
- how they protect their position
- what they may avoid saying directly
- how conflict may look different from what is happening internally

Make it behavioral, not dramatic.

## 5. Risk, Strategy and Timing

Explain the relationship to risk and timing.

Focus on:
- when the person may take risks
- when they may wait
- how they observe before acting
- where quick thinking helps
- where quick movement can become impulsive
- where over-strategy can delay action

Do not predict success or failure.

## 6. Loyalty, Trust and Boundaries

Describe social loyalty and trust patterns.

Focus on:
- how trust is tested
- what kind of loyalty matters
- what happens when respect decreases
- how the person may reduce access
- where they may keep things light instead of direct
- where boundaries become necessary

Do not invent relationship history.

## 7. Strengths in Human Environments

Describe useful strengths from this layer.

Focus on:
- reading people
- adjusting communication
- noticing openings
- connecting ideas or people
- responding quickly
- using humor, intelligence or strategy
- bringing movement into stagnant environments

Avoid flattery.
Show both usefulness and limits.

## 8. Social Self-Sabotage

Explain where this style becomes a trap.

Include:
- where adaptability becomes inconsistency
- where humor becomes avoidance
- where intelligence becomes over-strategy
- where social awareness becomes distrust
- where quick reaction becomes impatience
- where protecting freedom creates distance

Make this honest but not insulting.

## 9. Strong Chinese Zodiac Themes vs Secondary Nuances

Create two short subsections.

### Strong Chinese Zodiac Themes
List 3–5 themes that are strongly visible in the Chinese zodiac data.
For each:
- name the theme
- mention the general indicator supporting it
- translate it into real-life behavior

### Secondary Nuances
List 2–4 themes that are present but should not dominate the interpretation.
For each:
- explain why it is a nuance
- how it may show up situationally

This is important because Life Blueprint must not treat every symbolic detail as equally central.

## 10. Chinese Zodiac Recognition Points

Write 8–12 concrete recognition points.

Rules:
- No predictions.
- No biography.
- No therapy language.
- No mystical language.
- No animal sign names in this section.
- No luck, fortune or destiny language.
- Each point must be concrete enough that the reader can compare it with real life.

Good style:
- "You may read a room quickly, but not always reveal how much you noticed."
- "When pressure rises, humor or distance may appear before direct confrontation."
- "You may adapt fast, but later feel irritated if the adaptation cost you too much freedom."
- "You may keep the conversation light while privately deciding how much access someone still has."

Bad style:
- "You are clever."
- "You are lucky."
- "You are born for success."
- "Your sign gives you powerful energy."
- "Your animal sign makes you social."

## 11. Chinese Zodiac Chapter Summary

End with a grounded summary.

Say:
- this is only the Chinese zodiac layer
- it is not the whole Life Blueprint
- it does not define the person
- its value is in the social and strategic patterns the reader can verify
- the final synthesis will compare this layer with the other systems

No mystical ending.
No exaggerated promise.
No motivational speech.

OUTPUT RULES:
Return only the Chinese Zodiac chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not mention that you are an AI.
Do not apologize.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.68,
    max_tokens: 3400,
    messages: [
      {
        role: "system",
        content:
          "You are a serious symbolic interpretation writer for Life Blueprint. You translate Chinese zodiac symbolism into impartial social, adaptive and strategic behavior patterns without prediction, flattery, fear, diagnosis, biography invention, luck language, or mystical language.",
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