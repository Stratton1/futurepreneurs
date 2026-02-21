'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuizQuestion as QuizQuestionType } from '@/types/learning';

interface QuizSectionProps {
  quiz: QuizQuestionType[];
  moduleId: string;
  lessonId: string;
  onAllComplete: (answers: number[]) => Promise<{
    correctCount: number;
    totalQuestions: number;
    results: { isCorrect: boolean; explanation: string }[];
  } | null>;
  alreadyCompleted: boolean;
}

export function QuizSection({ quiz, onAllComplete, alreadyCompleted }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [finalResult, setFinalResult] = useState<{
    correctCount: number;
    totalQuestions: number;
    results: { isCorrect: boolean; explanation: string }[];
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (alreadyCompleted && !finalResult) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Quiz completed!</span>
        </div>
      </div>
    );
  }

  if (finalResult) {
    const percentage = Math.round((finalResult.correctCount / finalResult.totalQuestions) * 100);
    const isPerfect = finalResult.correctCount === finalResult.totalQuestions;
    const isGood = percentage >= 60;

    return (
      <div className="space-y-4">
        <div className={`rounded-xl p-6 text-center ${isPerfect ? 'bg-emerald-50 border border-emerald-200' : isGood ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex justify-center mb-3">
            <Trophy className={`h-10 w-10 ${isPerfect ? 'text-emerald-500' : isGood ? 'text-blue-500' : 'text-amber-500'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Quiz Complete!</h3>
          <p className="text-2xl font-bold mb-2">
            <span className={isPerfect ? 'text-emerald-600' : isGood ? 'text-blue-600' : 'text-amber-600'}>
              {finalResult.correctCount}/{finalResult.totalQuestions}
            </span>
            <span className="text-gray-400 text-lg ml-2">({percentage}%)</span>
          </p>
          <p className="text-gray-600 text-sm">
            {isPerfect
              ? 'Perfect score! You really know your stuff!'
              : isGood
                ? 'Great job! You\'ve got a solid understanding.'
                : 'Good effort! Review the lesson and try to remember the key points.'}
          </p>
        </div>

        <div className="space-y-3">
          {finalResult.results.map((r, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${r.isCorrect ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {r.isCorrect ? (
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium text-gray-800">Q{i + 1}: {quiz[i].question}</p>
                <p className="text-gray-600 mt-1">{r.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = quiz[currentIndex];

  const handleCheckAnswer = () => {
    if (selected === null) return;
    const isCorrect = currentQ.options[selected]?.isCorrect ?? false;
    setCurrentResult({ isCorrect, explanation: currentQ.explanation });
    setAnswered(true);
  };

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setAnswered(false);
      setCurrentResult(null);
    } else {
      // All questions answered — submit
      setSubmitting(true);
      const result = await onAllComplete(newAnswers);
      if (result) setFinalResult(result);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">
          Question {currentIndex + 1} of {quiz.length}
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + (answered ? 1 : 0)) / quiz.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">{currentQ.question}</h3>

        <div className="space-y-2">
          {currentQ.options.map((option, i) => {
            let classes = 'w-full text-left p-3 rounded-lg border-2 transition-colors text-sm ';
            if (answered) {
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
                onClick={() => !answered && setSelected(i)}
                disabled={answered}
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

        {!answered && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleCheckAnswer}
            disabled={selected === null}
          >
            Check Answer
          </Button>
        )}

        {currentResult && (
          <div className={`flex items-start gap-3 p-4 rounded-lg ${currentResult.isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            {currentResult.isCorrect ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${currentResult.isCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
                {currentResult.isCorrect ? 'Correct!' : 'Not quite!'}
              </p>
              <p className="text-sm text-gray-600 mt-1">{currentResult.explanation}</p>
            </div>
          </div>
        )}

        {answered && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            {submitting
              ? 'Submitting...'
              : currentIndex < quiz.length - 1
                ? (<>Next Question <ArrowRight className="h-4 w-4" /></>)
                : 'See Results'}
          </Button>
        )}
      </div>
    </div>
  );
}
