import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { name, date, time, place } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are an expert astrologer, numerologist, Jyotish reader, and Chinese zodiac interpreter.

Create a highly personalized premium life report for this person.

USER DATA:
Full name: ${name}
Date of birth: ${date}
Time of birth: ${time}
Place of birth: ${place}

INSTRUCTIONS:
- Combine Western astrology, Vedic astrology (Jyotish), numerology, and Chinese zodiac
- Write in a personal, insightful, emotionally intelligent tone
- Avoid generic lines
- Make it feel specific and premium
- Write directly to the person using "you"
- Focus on personality, inner conflicts, strengths, love patterns, career direction, and next phase in life

STRUCTURE:
1. Core Personality Blueprint
2. Your Life Path & Inner Drive
3. Hidden Strengths
4. Your Biggest Internal Conflict
5. Love & Relationship Patterns
6. Career, Money & Direction
7. Your Natural Advantage
8. What Keeps Holding You Back
9. Your Next Phase in Life
10. Final Personal Insight
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    return new Response(
      JSON.stringify({ report: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      { status: 500 }
    );
  }
}