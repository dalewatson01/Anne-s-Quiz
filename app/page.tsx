'use client';

import React, { useState, useEffect } from 'react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function DailyAIQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [quizDate, setQuizDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quiz')
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
          setQuizDate(data.date);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load quiz:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-serif text-stone-700 bg-stone-50 p-4">
        <h1 className="text-2xl font-bold mb-2">Anne's Daily Quiz</h1>
        <p className="text-stone-500 font-sans text-sm animate-pulse">
          Writing today's 15 brand-new questions...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-rose-700 bg-stone-50">
        Unable to load today's quiz. Please refresh the page.
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-10 px-4 font-serif text-stone-900">
      <div className="max-w-2xl mx-auto bg-white border border-stone-200 shadow-sm rounded-lg p-6 md:p-8">
        <header className="border-b border-stone-300 pb-4 mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Anne's Daily Quiz</h1>
          <p className="text-sm font-sans text-stone-500 uppercase tracking-widest mt-1">
            Broadsheet Edition • {quizDate}
          </p>
        </header>

        {!isFinished ? (
          <div>
            <div className="flex justify-between items-center font-sans text-xs text-stone-500 mb-4">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>

            <h2 className="text-xl font-semibold text-stone-800 mb-6 leading-snug">
              {currentQ.question}
            </h2>

            <div className="space-y-3 font-sans mb-6">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "border-stone-200 hover:bg-stone-50 text-stone-800";
                if (selectedOption !== null) {
                  if (idx === currentQ.correctAnswer) {
                    btnStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-medium";
                  } else if (idx === selectedOption) {
                    btnStyle = "border-rose-500 bg-rose-50 text-rose-900";
                  } else {
                    btnStyle = "border-stone-200 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-md border text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="font-semibold text-stone-400">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="bg-stone-100 p-4 rounded-md border border-stone-200 mb-6 font-sans text-xs text-stone-700">
                <strong className="block mb-1 text-stone-900 font-serif text-sm">Background & Context:</strong>
                {currentQ.explanation}
              </div>
            )}

            {selectedOption !== null && (
              <button
                onClick={handleNext}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-sans py-3 rounded-md text-sm font-medium transition-colors"
              >
                {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question →"}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 font-sans">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Quiz Complete!</h2>
            <p className="text-stone-600 mb-6">
              You scored <span className="font-bold text-stone-900">{score}</span> out of {questions.length}.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md max-w-sm mx-auto text-xs text-amber-900">
              Check back tomorrow for a brand new edition!
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

