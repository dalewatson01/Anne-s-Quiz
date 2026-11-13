import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured', details: 'GEMINI_API_KEY is missing from environment variables.' },
      { status: 500 }
    );
  }

  const prompt = `
Generate a 15-question broadsheet-style general knowledge quiz covering history, science, literature, architecture, geography, and 1960s+ pop culture. 
You must output ONLY valid JSON in the following exact format, with no markdown code blocks or additional text:
{
  "title": "The Daily Broadsheet Quiz",
  "date": "${new Date().toISOString().split('T')[0]}",
  "questions": [
    {
      "id": 1,
      "category": "History",
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "answer": "A) Option 1",
      "explanation": "Brief, elegant explanation of the answer."
    }
  ]
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API request failed');
    }

    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error('No candidates returned from Gemini API.');
    }

    const rawText = candidate.content.parts[0].text;
    
    // Clean up any stray markdown code markers if present
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizJson = JSON.parse(cleanedText);

    return NextResponse.json(quizJson);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily quiz', details: String(error) },
      { status: 500 }
    );
  }
}
