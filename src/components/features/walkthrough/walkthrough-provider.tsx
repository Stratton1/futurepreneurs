'use client';

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { WalkthroughOverlay } from './walkthrough-overlay';
import type { WalkthroughStep } from '@/lib/walkthrough/types';

interface WalkthroughContextValue {
  isActive: boolean;
  currentStep: number;
  startWalkthrough: (role: string) => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  complete: () => void;
  isCompleted: (role: string) => boolean;
}

export const WalkthroughContext = createContext<WalkthroughContextValue | null>(null);

interface StepDefinitions {
  [role: string]: WalkthroughStep[];
}

interface WalkthroughProviderProps {
  children: ReactNode;
  steps: StepDefinitions;
  userRole?: string;
  autoStart?: boolean;
}

function getStorageKey(role: string) {
  return `walkthrough_${role}_complete`;
}

export function WalkthroughProvider({ children, steps, userRole, autoStart = true }: WalkthroughProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const isCompleted = useCallback((role: string): boolean => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(getStorageKey(role)) === 'true';
  }, []);

  const startWalkthrough = useCallback((role: string) => {
    if (!steps[role] || steps[role].length === 0) return;
    setActiveRole(role);
    setCurrentStep(0);
    setIsActive(true);
  }, [steps]);

  const completeWalkthrough = useCallback(() => {
    if (activeRole) {
      localStorage.setItem(getStorageKey(activeRole), 'true');
    }
    setIsActive(false);
    setCurrentStep(0);
    setActiveRole(null);
  }, [activeRole]);

  const next = useCallback(() => {
    if (!activeRole) return;
    const roleSteps = steps[activeRole];
    if (!roleSteps) return;

    if (currentStep < roleSteps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      completeWalkthrough();
    }
  }, [activeRole, currentStep, steps, completeWalkthrough]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const skip = useCallback(() => {
    completeWalkthrough();
  }, [completeWalkthrough]);

  // Auto-start for first-time users
  useEffect(() => {
    if (!autoStart || !userRole || !steps[userRole]) return;
    if (isCompleted(userRole)) return;

    // Delay to let the dashboard render first
    const timer = setTimeout(() => {
      startWalkthrough(userRole);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoStart, userRole, steps, isCompleted, startWalkthrough]);

  const activeSteps = activeRole ? steps[activeRole] || [] : [];

  return (
    <WalkthroughContext.Provider
      value={{
        isActive,
        currentStep,
        startWalkthrough,
        next,
        prev,
        skip,
        complete: completeWalkthrough,
        isCompleted,
      }}
    >
      {children}
      {isActive && activeSteps.length > 0 && (
        <WalkthroughOverlay
          steps={activeSteps}
          currentStep={currentStep}
          onNext={next}
          onPrev={prev}
          onSkip={skip}
        />
      )}
    </WalkthroughContext.Provider>
  );
}
