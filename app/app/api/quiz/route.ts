import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date().toLocaleDateString('en-AU', { 
    timeZone: 'Australia/Melbourne',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const prompt = `Generate a 15-question general knowledge quiz for ${today}. 
  Topics should cover a rich, diverse range including history, literature, cinema, science, music, and general trivia, with an engaging broadsheet puzzle style.
  
  Return strictly valid JSON format matching this array structure with no extra text or markdown formatting:
  [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief 1-sentence background/context."
    }
  ]`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const questions = JSON.parse(rawText);

    return NextResponse.json({ date: today, questions });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate daily quiz" }, { status: 500 });
  }
}

