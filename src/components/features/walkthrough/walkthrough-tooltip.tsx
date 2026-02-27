'use client';

import { X } from 'lucide-react';

export interface WalkthroughTooltipProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  position: 'top' | 'bottom' | 'left' | 'right';
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function WalkthroughTooltip({
  title,
  description,
  currentStep,
  totalSteps,
  position,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: WalkthroughTooltipProps) {
  const arrowClasses: Record<string, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white',
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 w-80 animate-scale-up">
      {/* Arrow */}
      <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />

      {/* Close button */}
      <button
        onClick={onSkip}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Skip walkthrough"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Content */}
      <h3 className="text-base font-bold text-gray-900 mb-1.5 pr-6">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'w-6 bg-emerald-500'
                : i < currentStep
                  ? 'w-1.5 bg-emerald-300'
                  : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSkip}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip tour
        </button>
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-lg transition-colors"
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
