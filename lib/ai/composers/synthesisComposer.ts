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
You are writing the FINAL SYNTHESIS CHAPTER of Life Blueprint.

This is the most important chapter of the product.

PRODUCT DEFINITION:
Life Blueprint is not a horoscope.
Life Blueprint is not therapy.
Life Blueprint is not fortune telling.
Life Blueprint is not a personality test.
Life Blueprint is not spiritual entertainment.
Life Blueprint is not manipulation.

Life Blueprint is an impartial symbolic blueprint built from minimal objective input:
- full name
- birth date
- birth time
- birth place

It uses four symbolic systems:
- Western astrology
- Jyotish / Vedic astrology
- Numerology
- Chinese zodiac

The goal is not to prove that these systems are absolute truth.
The goal is not to force belief.
The goal is not to flatter, scare, impress, manipulate or confirm the user's self-image.

The goal is to translate the cleanest possible repeated symbolic patterns into clear human language.

The reader should be able to say:
"This does not claim to know everything about me."
"This does not flatter me."
"This does not manipulate me."
"But it gives me a structured mirror I can compare with my real life."

LANGUAGE:
Write in ${language}.
If writing in Croatian, use "ti", never "Vi".
Use natural Croatian, not Serbian phrasing.
Use clear, serious, precise language.

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

CORE WRITING PRINCIPLE:
You are not inventing biography.
You are not describing private facts.
You are not claiming certainty.
You are translating symbolic convergence into behavioral possibilities.

Write with this logic:
- "This pattern is strongly supported when several systems point to the same theme."
- "This is a secondary nuance when it appears in only one or two layers."
- "In real life, this can often show up as..."
- "Compare this with your own life and keep what proves useful."

Do not overuse disclaimers.
Do not weaken every sentence.
But never sound like you know absolute truth.

ABSOLUTE ETHICAL RULES:
- Do not invent trauma.
- Do not invent relationship history.
- Do not invent job, family, divorce, childhood, health, money or life events.
- Do not diagnose.
- Do not predict the future.
- Do not say what will happen.
- Do not present astrology, Jyotish, numerology or Chinese zodiac as scientific proof.
- Do not flatter.
- Do not scare.
- Do not use mystical language.
- Do not create dependency on future readings.
- Do not write generic AI self-help text.

STYLE RULES:
Avoid:
- "This chapter explores..."
- "This can help you understand..."
- "It is important to recognize..."
- "You may sometimes..."
- "Maybe..."
- "Your destiny..."
- "Your energy..."
- "Your vibration..."
- "The universe..."
- "Your soul chose..."

Prefer:
- concrete behavioral translation
- clean symbolic reasoning
- direct but fair language
- practical examples
- private vs public contrast
- real-life expressions of patterns
- clear distinction between strong themes and weaker nuances

QUALITY BAR:
If a sentence could fit almost anyone, rewrite it.
If it sounds like coaching content, rewrite it.
If it sounds like a horoscope website, rewrite it.
If it sounds like therapy, rewrite it.
If it sounds like manipulation, rewrite it.
If it claims too much certainty, rewrite it.
If it has no concrete life expression, rewrite it.

TASK:
Write the final synthesis chapter of the Life Blueprint report.

TARGET LENGTH:
1500–2500 words.

STRUCTURE:

# Full Life Blueprint Synthesis

Start with a short introduction.
Explain that this chapter no longer reads the four systems separately.
It looks for repeated themes across them.
Clarify that this is not absolute truth, but a symbolic map the reader can compare with real life.
Keep this introduction short and serious.

## 1. Strongly Supported Core Pattern

Identify the strongest repeated pattern across the systems.

Explain:
- what appears repeatedly
- which general layers support it
- what this pattern means behaviorally
- how it can show up in everyday life
- what the person may recognize if this pattern is active

Do not list every planet, number or sign.
Do not over-explain symbols.
Translate them.

Use wording like:
"Several layers point toward..."
"The repeated theme is..."
"This does not prove a fact about your life, but it gives a clear symbolic direction..."

## 2. Public Presentation vs Private Process

Explain:
- what the person may show outwardly
- what may be happening internally
- where others may misread them
- what they may keep private
- where the outer behavior and inner process do not match

Include concrete examples:
- how they answer when something bothers them
- how they behave when pressure builds
- what others see late, after the internal process has already happened

## 3. Main Inner Tension

Describe the main contradiction or tension.

Use only what is supported by the data.

Possible tension types:
- freedom vs responsibility
- control vs trust
- closeness vs self-protection
- analysis vs action
- service to others vs self-respect
- stability vs movement
- emotional depth vs guarded expression

Explain:
- why both sides have logic
- how the tension creates pressure
- how it may repeat in life
- what happens when one side dominates too long

## 4. Decision Pattern

Explain how decisions are likely processed.

Include:
- what kind of decision drains the person
- where they delay
- where they move suddenly after long internal processing
- what creates relief
- what creates regret
- how they can make cleaner decisions

Avoid generic advice.
Use real-life behavioral examples.

## 5. Trust and Emotional Access

Explain the trust pattern.

Focus on:
- how trust is built
- how it is tested
- what happens before trust is openly discussed
- how emotional access changes when disappointment repeats
- what the person may not say directly

Important:
Do not claim specific betrayal or trauma.
Describe the pattern, not invented events.

## 6. Self-Sabotage Pattern

Explain where the person's own strengths can become traps.

Include:
- where analysis becomes delay
- where responsibility becomes burden
- where independence becomes isolation
- where high standards become paralysis
- where emotional protection becomes distance
- where adaptation becomes loss of direction

Make this honest but not insulting.

## 7. Work, Direction and Use of Potential

Explain the life/work direction shown by the synthesis.

Focus on:
- what kind of environment supports the person
- what kind of work rhythm fits
- where they need autonomy
- where they need structure
- how they behave when they feel they are wasting potential
- what kind of contribution feels meaningful

Do not invent their actual job.
Speak in patterns.

## 8. Relationships and Repeating Dynamics

Explain relationship patterns without romantic clichés.

Include:
- what the person may give
- what they may quietly expect
- what they tolerate too long
- what they stop giving when trust decreases
- how they may withdraw before explaining
- what kind of communication would prevent unnecessary distance

Do not invent relationship history.

## 9. Strong Themes vs Secondary Nuances

Create two short subsections.

### Strongly Supported Themes
List 4–6 themes that appear strongly across the systems.
For each theme, write:
- the theme
- why it appears strong
- how it can show up in real life

### Secondary Nuances
List 3–5 weaker or more situational themes.
For each, explain that it should be read as a nuance, not the center of the report.

This section is important because Life Blueprint must not treat every interpretation as equally certain.

## 10. Recognition Points

Write 15–25 recognition points.

These are not absolute claims.
They are concrete mirrors.

Each point should be specific and real-life based.

Good style:
- "You can stay functional while internally already distancing yourself."
- "People may notice the final decision, not the long private process before it."
- "You may not always confront immediately; sometimes you first reduce access."
- "When something feels wrong, you often need internal proof before you act."
- "Responsibility can make you reliable, but also quietly resentful if nobody sees the weight you carry."

Bad style:
- "You are emotional."
- "You are complex."
- "You need to love yourself."
- "You are destined for greatness."
- "You have strong energy."

Rules:
- Do not mention astrology, numerology, Jyotish or Chinese zodiac in this section.
- Do not mention signs, houses, planets or numbers.
- Do not claim events.
- Make each point concrete.
- Make each point useful.

## 11. Practical Direction

Give practical direction, not motivational speech.

Include:
- what to observe in yourself
- what to say earlier
- what to stop carrying silently
- what to stop tolerating
- where to use structure
- where to allow movement
- how to test whether this report is accurate in real life

Avoid:
- "follow your dreams"
- "believe in yourself"
- "everything happens for a reason"

## 12. Final Summary

End with a grounded summary.

Say:
- this report is not a verdict
- it is not absolute truth
- it is a symbolic map
- its value is in what the reader can verify
- the goal is not to become someone else
- the goal is to see one's own patterns more clearly

No cheesy ending.
No mystical ending.
No exaggerated promise.

OUTPUT RULES:
Return only the final chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not mention that you are an AI.
Do not apologize.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.68,
    max_tokens: 4500,
    messages: [
      {
        role: "system",
        content:
          "You are a serious symbolic synthesis writer. You create impartial Life Blueprint chapters from structured symbolic data. You do not flatter, scare, diagnose, predict, invent biography, or claim absolute truth. You write concrete, grounded, useful behavioral synthesis.",
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