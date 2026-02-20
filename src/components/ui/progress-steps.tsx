'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li key={step.label} className={clsx('relative', index !== steps.length - 1 && 'flex-1')}>
              <div className="flex items-center">
                <div
                  className={clsx(
                    'relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isCompleted && 'bg-emerald-500 text-white',
                    isCurrent && 'bg-emerald-500 text-white ring-4 ring-emerald-100',
                    isUpcoming && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={clsx(
                      'ml-2 mr-2 h-0.5 flex-1',
                      isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
              <div className="mt-1.5">
                <span
                  className={clsx(
                    'text-xs font-medium',
                    isCurrent ? 'text-emerald-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
