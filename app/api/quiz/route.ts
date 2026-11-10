import { NextResponse } from 'next/server';

export const maxDuration = 60;

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function GET() {
  const today = new Date().toLocaleDateString('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = `Generate a 15-question general knowledge quiz for ${today}.
Topics should cover history, literature, cinema, science, music, and general trivia.
Return only a JSON array with objects containing question, options (four strings), correctAnswer (zero-based number), and explanation.`;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'The quiz service is not configured. Set GEMINI_API_KEY to enable daily questions.' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini returned no quiz content.');

    const questions = JSON.parse(rawText);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Gemini returned an invalid quiz.');
    }

    return NextResponse.json({ date: today, questions });
  } catch (error) {
    console.error('AI quiz generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate today’s quiz.' }, { status: 502 });
  }
}
