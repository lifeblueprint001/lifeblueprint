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
You are writing the WESTERN ASTROLOGY CHAPTER of a Life Blueprint report.

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

This chapter uses Western astrology as one symbolic system.
The goal is not to convince the reader that astrology is absolute truth.
The goal is to translate the Western astrological configuration into a clear, grounded behavioral map.

The reader should see:
- which main Western indicators are being used
- what they symbolically point toward
- how those symbols can translate into behavior, decisions, pressure, relationships and life direction
- what is strongly visible in this system
- what is only a secondary nuance

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

WESTERN STRUCTURED DATA:
${JSON.stringify(westernParsed, null, 2)}

CORE WRITING PRINCIPLE:
Symbols are the foundation.
The report is the translation.

Do not bury the reader in astrology theory.
Do not write an encyclopedia of signs, houses and planets.
Do not write generic horoscope text.

Use the astrological data seriously, but translate it into:
- behavior
- pressure patterns
- emotional processing
- decision habits
- public vs private contrast
- relational tendencies
- work and ambition patterns
- self-sabotage risks
- usable self-observation

IMPORTANT ETHICAL RULES:
- Do not invent biography.
- Do not invent trauma.
- Do not invent relationship history.
- Do not invent job, family, divorce, childhood, health or life events.
- Do not diagnose.
- Do not predict the future.
- Do not say what will happen.
- Do not present astrology as scientific proof.
- Do not flatter.
- Do not scare.
- Do not use mystical language.
- Do not write like a horoscope website.
- Do not write generic AI self-help content.

STYLE RULES:
Avoid:
- "Your destiny..."
- "The universe..."
- "Your energy..."
- "Your vibration..."
- "You are meant to..."
- "This chapter explores..."
- "This can help you understand..."
- "It is important to recognize..."
- "You may sometimes..." repeated too often
- exaggerated certainty
- vague personality labels

Prefer:
- "This configuration points toward..."
- "In behavior, this can often look like..."
- "The stronger Western indicators suggest..."
- "This should be read as a pattern, not a fixed identity."
- "If this is active in your life, it may show up as..."
- concrete real-life examples
- private vs public contrast
- honest but fair language

QUALITY BAR:
If a sentence could fit almost anyone, rewrite it.
If it sounds like entertainment astrology, rewrite it.
If it sounds like therapy, rewrite it.
If it sounds like motivational coaching, rewrite it.
If it claims too much certainty, rewrite it.
If it does not translate a symbol into real behavior, rewrite it.

TASK:
Write the Western Astrology chapter of the Life Blueprint report.

TARGET LENGTH:
1300–2200 words.

STRUCTURE:

# Western Astrology Blueprint

Start with a short introduction.
Explain that this chapter uses Western astrology as a symbolic system.
Clarify that it is not a verdict, prediction or absolute truth.
Keep it short.

## 1. Main Western Indicators

Briefly name the most important Western indicators from the data.

Use only the indicators that are actually available in the structured data.

Include things like:
- Sun
- Moon
- Ascendant
- Mercury
- Venus
- Mars
- Jupiter
- Saturn
- Midheaven / MC
- houses or dominant themes if available

For each, give one clear sentence:
- what the indicator generally represents
- what this specific placement points toward

Do not over-explain.
This section should orient the reader, not overwhelm them.

## 2. Core Behavioral Pattern

Translate the strongest Western pattern into behavior.

Explain:
- what appears central in this system
- how identity, instinct and behavior seem to organize themselves
- what the person may repeatedly try to improve, control, prove, protect or understand
- how this may show up in everyday life

Use concrete examples, but do not invent life events.

## 3. Public Presentation vs Private Process

Use Ascendant, Moon, Sun and relevant planets to describe the difference between:
- how the person may appear outwardly
- what may happen privately
- what others may misread
- what the person may not show immediately

Include real behavioral contrast.

Example style:
"Outwardly, this can look like composure. Privately, the process may be much more active, critical or emotionally charged."

## 4. Emotional Processing

Use the Moon and relevant emotional indicators.

Describe:
- what the emotional system may need
- what creates pressure
- how emotions may be protected, hidden, dramatized, analyzed or controlled
- what happens when emotions are not expressed directly
- what others may not understand about the person emotionally

Do not claim trauma.
Describe pattern only.

## 5. Mind, Speech and Decision Logic

Use Mercury and relevant analytical indicators.

Explain:
- how the mind processes information
- what kind of details it notices
- where analysis becomes strength
- where analysis becomes delay, criticism or overload
- how communication may change under pressure

Include concrete examples:
- how the person responds in conflict
- how they think before speaking
- what kind of unclear communication frustrates them

## 6. Love, Attachment and Trust

Use Venus, 7th house themes if available, Moon and related indicators.

Explain:
- what the person may seek in closeness
- how trust is built
- what they may give quietly
- what they may expect but not say
- how disappointment may change emotional access
- where protection can become distance

Do not write romantic clichés.
Do not invent relationship history.

## 7. Action, Anger and Pressure

Use Mars and relevant pressure indicators.

Explain:
- how action is taken
- what triggers intensity
- how anger or frustration may be expressed or controlled
- what happens when pressure builds for too long
- where the person may become silent, sharp, strategic, impatient or withdrawn

Make it behavioral, not dramatic.

## 8. Responsibility, Fear and Maturity

Use Saturn and relevant structural indicators.

Explain:
- where the chart shows pressure, responsibility or self-discipline
- what kind of fear may slow expression
- where high standards help
- where high standards become punishment
- what maturity means in this symbolic system

Do not shame the person.
Do not soften too much.

## 9. Work Direction and Public Role

Use Midheaven / MC, 10th house themes and relevant planets if available.

Explain:
- what kind of contribution this system points toward
- how the person may want to be respected
- what kind of work environment may support them
- where they may feel underused
- what happens when their depth, precision or effort is not recognized

Do not invent the actual job.

## 10. Strong Western Themes vs Secondary Nuances

Create two short subsections.

### Strong Western Themes
List 4–6 themes that are strongly visible in the Western data.
For each:
- name the theme
- mention the general indicators supporting it
- translate it into real-life behavior

### Secondary Nuances
List 3–5 themes that are present but should not dominate the interpretation.
For each:
- explain why it is a nuance
- how it may show up situationally

This is important because Life Blueprint must not treat every symbol as equally important.

## 11. Western Recognition Points

Write 10–15 concrete recognition points.

Rules:
- No predictions.
- No biography.
- No therapy language.
- No mystical language.
- No generic personality labels.
- No signs, houses or planet names in this section.
- Each point must be concrete enough that the reader can compare it with real life.

Good style:
- "People may notice the final decision, not the long private process before it."
- "You can appear calm while internally sorting details, risks and emotional reactions."
- "When trust decreases, you may reduce access before you explain what changed."
- "You may become sharp not because you want conflict, but because something has been processed internally for too long."

Bad style:
- "You are emotional."
- "You are strong."
- "You are complex."
- "You need to believe in yourself."
- "You have powerful energy."

## 12. Western Chapter Summary

End with a grounded summary.

Say:
- this is only the Western layer
- it is not the whole Life Blueprint
- its strongest value is in the patterns the reader can verify
- the final synthesis will compare this layer with the other systems

No mystical ending.
No exaggerated promise.
No motivational speech.

OUTPUT RULES:
Return only the Western chapter text.
Do not return JSON.
Do not include markdown tables.
Do not mention this prompt.
Do not mention that you are an AI.
Do not apologize.
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.68,
    max_tokens: 4300,
    messages: [
      {
        role: "system",
        content:
          "You are a serious symbolic interpretation writer for Life Blueprint. You translate Western astrology into impartial behavioral patterns without prediction, flattery, fear, diagnosis, biography invention, or mystical language.",
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