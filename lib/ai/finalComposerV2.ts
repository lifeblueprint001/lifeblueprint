export async function finalComposer({
  openai,
  fullName,
  birthDate,
  birthTime,
  birthPlace,
  western,
  numerology,
  jyotish,
  chinese,
  synthesis,
}: {
  openai: any;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  western: any;
  numerology: any;
  jyotish: any;
  chinese: any;
  synthesis: any;
}) {
  const prompt = `
You are writing a premium Life Blueprint report.

This is NOT:
- a horoscope
- a personality test
- a motivational article

This IS:
a complete multi-system human blueprint.

The report combines:

1. Western Astrology
2. Jyotish
3. Numerology
4. Chinese Zodiac

The purpose is not prediction.

The purpose is understanding.

The user should finish the report feeling:

"I understand why I behave the way I do."

==================================================
CORE PRODUCT RULE
==================================================

The user paid for four symbolic systems.

Do not rush into conclusions.

First explain the systems.

Then explain the meanings.

Then explain how the systems interact.

Then create the final synthesis.

The user should feel:

1. I understand my chart.
2. I understand my symbolic profile.
3. I understand how the systems connect.
4. I understand myself.

==================================================
REPORT QUALITY
==================================================

This must feel like a premium personalized book.

Not a short report.

Not an article.

Not a summary.

The report should feel like:

20-35 pages.

Take time to explain.

Do not compress information.

Use examples.

Use detailed interpretation.

==================================================
SECTION LENGTH RULES
==================================================

Western Astrology Blueprint:
minimum 1800 words

Jyotish Blueprint:
minimum 1200 words

Numerology Blueprint:
minimum 800 words

Chinese Zodiac Blueprint:
minimum 800 words

Behavioral Synthesis:
minimum 1200 words

Recognition Moments:
20-30 items

Micro Behaviors:
20-30 items

Target report length:
7000-12000 words

USER DATA:
Full name: ${fullName}
Date of birth: ${birthDate}
Time of birth: ${birthTime}
Place of birth: ${birthPlace}

WESTERN ANALYSIS:
${JSON.stringify(western, null, 2)}

NUMEROLOGY ANALYSIS:
${JSON.stringify(numerology, null, 2)}

JYOTISH ANALYSIS:
${JSON.stringify(jyotish, null, 2)}

CHINESE ZODIAC ANALYSIS:
${JSON.stringify(chinese, null, 2)}

SYNTHESIS:
${JSON.stringify(synthesis, null, 2)}

==================================================
LANGUAGE RULE
==================================================

Write the final report in Croatian if the birth place suggests Croatia, Serbia, Bosnia and Herzegovina, Montenegro, Slovenia, North Macedonia or nearby Balkan region.
Otherwise write the final report in English.

Use only one language in the final report.

If writing in Croatian:
- use "ti"
- never use "Vi"
- avoid Serbian forms such as "raport", "porodica", "osjećanja"
- prefer Croatian forms such as "izvještaj", "obitelj", "osjećaji"

==================================================
STYLE
==================================================

The report must feel:
- premium
- personal
- grounded
- structured
- intelligent
- emotionally specific
- worth paying for

It must NOT feel:
- like raw JSON
- like a generic horoscope
- like therapy
- like motivational coaching
- like spiritual fantasy

Avoid overusing:
"energija", "vibracija", "svemir", "manifestacija", "putovanje", "sudbina".

Do not diagnose.
Do not predict exact future events.
Use future direction only as pattern-based guidance.

==================================================
CORE PRODUCT GOAL
==================================================

The user should not only think:
"This is interesting."

The user should think:
"This explains how I function."

The strongest parts of the report must be:
- recognition moments
- micro behaviors
- hidden contradictions
- life mechanism
- decision loop
- public self vs private self

Focus on small real-life behaviors, not only broad personality descriptions.

==================================================
REPORT STRUCTURE
==================================================

# LIFE BLUEPRINT

## Introduction

Explain:

- what this report is
- why four systems are used
- why no single system explains a person completely
- why synthesis matters

--------------------------------------------------

# PART I
WESTERN ASTROLOGY BLUEPRINT

## Ascendant

Explain:
- what the ascendant represents
- how people perceive the person
- strengths
- blind spots
- real-life examples

## Sun

Explain:
- identity
- motivation
- behavior
- work
- relationships

## Moon

Explain:
- emotions
- emotional needs
- emotional reactions
- attachment

## Mercury

Explain:
- thinking style
- communication
- learning

## Venus

Explain:
- relationships
- attraction
- connection style

## Mars

Explain:
- action
- ambition
- conflict
- energy

## Jupiter

Explain:
- growth
- opportunities
- expansion

## Saturn

Explain:
- lessons
- discipline
- responsibility

## Western Astrology Synthesis

Explain what emerges when all placements work together.

--------------------------------------------------

# PART II
JYOTISH BLUEPRINT

## Core Life Theme

## Development Path

## Internal Conflict

## Relationships

## Work and Responsibility

## Personal Growth

## Jyotish Synthesis

Translate symbolism into real-life behavior.

Avoid mystical language.

--------------------------------------------------

# PART III
NUMEROLOGY BLUEPRINT

## Life Path Number

## Expression Number

## Motivation Pattern

## Natural Talents

## Challenges

## Numerology Synthesis

Use practical examples.

--------------------------------------------------

# PART IV
CHINESE ZODIAC BLUEPRINT

## Instinctive Style

## Social Behavior

## Adaptability

## Emotional Defense

## Strengths

## Blind Spots

## Chinese Zodiac Synthesis

--------------------------------------------------

# PART V
WHERE ALL SYSTEMS AGREE

Explain:

- what Western Astrology sees
- what Jyotish sees
- what Numerology sees
- what Chinese Zodiac sees

Then explain:

What all four systems describe together.

This should feel powerful and insightful.

--------------------------------------------------

# PART VI
BEHAVIORAL SYNTHESIS

Use synthesis heavily.

Explain:

- corePattern
- mainContradiction
- lifeMechanism
- repeatingLoop
- hiddenStrength
- emotionalDefense
- selfSabotagePattern
- futureDirection

--------------------------------------------------

# PART VII
RECOGNITION MOMENTS

20-30 recognition moments.

Short.

Specific.

Concrete.

The reader should repeatedly think:

"That is exactly what I do."

--------------------------------------------------

# PART VIII
MICRO BEHAVIORS

20-30 micro behaviors.

Small everyday actions.

No explanations.

--------------------------------------------------

# PART IX
PUBLIC SELF VS PRIVATE SELF

## What People See

## What Actually Happens Internally

--------------------------------------------------

# PART X
RELATIONSHIPS

Trust

Attachment

Conflict

Emotional Needs

Relationship Patterns

--------------------------------------------------

# PART XI
CAREER, MONEY AND DIRECTION

Work Style

Motivation

Leadership

Decision Making

Money Behavior

--------------------------------------------------

# PART XII
LIFE BLUEPRINT

If current patterns continue.

If conscious change happens.

Highest growth path.

No predictions.

--------------------------------------------------

# PART XIII
FINAL MESSAGE

Grounded.

Human.

Powerful.

No spiritual clichés.

==================================================
QUALITY RULES
==================================================

VERY IMPORTANT

Do not shorten sections.

Do not summarize.

Do not rush.

Explain before synthesizing.

Use the actual data provided.

Avoid generic statements.

Avoid repeating the same pattern too many times.

The report should feel expensive.

Now write the complete report.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.85,
    messages: [
      {
        role: "system",
        content:
          "You compose premium personal reports from structured analysis. You do not invent new systems; you transform structured data into a clear human-readable report.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}