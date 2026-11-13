import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const prompt = `Return a 15-question general knowledge quiz in JSON format with categories: History, Science, Literature, Architecture, Geography, Pop Culture. 
Use this exact structure with no markdown or backticks in your reply:
{
  "title": "The Daily Broadsheet Quiz",
  "date": "${new Date().toISOString().split('T')[0]}",
  "questions": [
    {
      "id": 1,
      "category": "History",
      "question": "Sample question text?",
      "options": ["A) Choice 1", "B) Choice 2", "C) Choice 3", "D) Choice 4"],
      "answer": "A) Choice 1",
      "explanation": "Sample explanation text."
    }
  ]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API error');
    }

    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error('No candidates returned from Gemini API.');
    }

    let rawText = candidate.content.parts[0].text;
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const quizJson = JSON.parse(rawText);
    return NextResponse.json(quizJson);

  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily quiz', details: String(error) },
      { status: 500 }
    );
  }
}

