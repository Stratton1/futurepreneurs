'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { WalkthroughTooltip } from './walkthrough-tooltip';
import type { WalkthroughStep } from '@/lib/walkthrough/types';

interface WalkthroughOverlayProps {
  steps: WalkthroughStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function WalkthroughOverlay({ steps, currentStep, onNext, onPrev, onSkip }: WalkthroughOverlayProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const step = steps[currentStep];

  const updateRect = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-walkthrough="${step.target}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const padding = 8;
      setTargetRect({
        top: rect.top + window.scrollY - padding,
        left: rect.left + window.scrollX - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Scroll element into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [updateRect]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft' && currentStep > 0) onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSkip, onNext, onPrev, currentStep]);

  if (!mounted || !step) return null;

  const position = step.position || 'bottom';

  // Calculate tooltip position relative to target
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' };
    }

    const viewportTop = targetRect.top - window.scrollY;
    const gap = 16;

    switch (position) {
      case 'bottom':
        return {
          position: 'fixed',
          top: viewportTop + targetRect.height + gap,
          left: targetRect.left + targetRect.width / 2 - window.scrollX,
          transform: 'translateX(-50%)',
        };
      case 'top':
        return {
          position: 'fixed',
          bottom: window.innerHeight - viewportTop + gap,
          left: targetRect.left + targetRect.width / 2 - window.scrollX,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          position: 'fixed',
          top: viewportTop + targetRect.height / 2,
          right: window.innerWidth - (targetRect.left - window.scrollX) + gap,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          position: 'fixed',
          top: viewportTop + targetRect.height / 2,
          left: targetRect.left + targetRect.width + gap - window.scrollX,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          position: 'fixed',
          top: viewportTop + targetRect.height + gap,
          left: targetRect.left + targetRect.width / 2 - window.scrollX,
          transform: 'translateX(-50%)',
        };
    }
  };

  const overlay = (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-modal="true" aria-label="Walkthrough guide">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300" onClick={onSkip} />

      {/* Spotlight cutout */}
      {targetRect && (
        <div
          className="absolute rounded-xl ring-4 ring-emerald-400/50 transition-all duration-500 ease-out"
          style={{
            top: targetRect.top - window.scrollY,
            left: targetRect.left - window.scrollX,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'transparent',
            zIndex: 1,
          }}
        />
      )}

      {/* Tooltip */}
      <div style={{ ...getTooltipStyle(), zIndex: 2 }}>
        <WalkthroughTooltip
          title={step.title}
          description={step.description}
          currentStep={currentStep}
          totalSteps={steps.length}
          position={position}
          onNext={onNext}
          onPrev={onPrev}
          onSkip={onSkip}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 1}
        />
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
