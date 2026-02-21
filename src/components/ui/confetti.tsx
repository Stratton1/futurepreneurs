'use client';

import { useEffect, useState } from 'react';

const COLOURS = [
  'bg-emerald-400', 'bg-blue-400', 'bg-amber-400', 'bg-pink-400',
  'bg-purple-400', 'bg-red-400', 'bg-yellow-400', 'bg-indigo-400',
];

interface ConfettiPiece {
  id: number;
  colour: string;
  left: string;
  delay: string;
  duration: string;
  size: string;
  rotation: string;
}

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    colour: COLOURS[i % COLOURS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    size: `${4 + Math.random() * 6}px`,
    rotation: `${Math.random() * 360}deg`,
  }));
}

/**
 * CSS-only confetti celebration animation.
 * Shows colourful pieces falling for a few seconds then auto-hides.
 */
export function Confetti({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [pieces] = useState<ConfettiPiece[]>(() => generatePieces());

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute rounded-sm ${piece.colour} animate-confetti-fall`}
          style={{
            left: piece.left,
            top: '-10px',
            width: piece.size,
            height: piece.size,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `rotate(${piece.rotation})`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
