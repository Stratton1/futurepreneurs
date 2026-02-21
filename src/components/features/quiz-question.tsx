'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuizQuestion as QuizQuestionType } from '@/types/learning';

interface QuizQuestionProps {
  quiz: QuizQuestionType;
  moduleId: string;
  lessonId: string;
  onComplete: (selectedIndex: number) => Promise<{ isCorrect: boolean; explanation: string } | null>;
  alreadyCompleted?: boolean;
}

export function QuizQuestion({ quiz, onComplete, alreadyCompleted }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (alreadyCompleted && !result) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Quiz completed!</span>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (selected === null) return;
    setLoading(true);
    const res = await onComplete(selected);
    if (res) setResult(res);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">{quiz.question}</h3>

      <div className="space-y-2">
        {quiz.options.map((option, i) => {
          let classes = 'w-full text-left p-3 rounded-lg border-2 transition-colors text-sm ';
          if (result) {
            if (option.isCorrect) {
              classes += 'border-emerald-500 bg-emerald-50 text-emerald-800';
            } else if (i === selected && !option.isCorrect) {
              classes += 'border-red-300 bg-red-50 text-red-800';
            } else {
              classes += 'border-gray-200 bg-white text-gray-500';
            }
          } else if (i === selected) {
            classes += 'border-blue-500 bg-blue-50 text-blue-800';
          } else {
            classes += 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50';
          }

          return (
            <button
              key={i}
              className={classes}
              onClick={() => !result && setSelected(i)}
              disabled={!!result}
            >
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {option.text}
              </span>
            </button>
          );
        })}
      </div>

      {!result && (
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={selected === null || loading}
        >
          {loading ? 'Checking...' : 'Check Answer'}
        </Button>
      )}

      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-lg ${result.isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          {result.isCorrect ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${result.isCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
              {result.isCorrect ? 'Correct!' : 'Not quite — but you still completed the lesson!'}
            </p>
            <p className="text-sm text-gray-600 mt-1">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
