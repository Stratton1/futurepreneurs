'use client';

import { useState } from 'react';

interface FlipCardProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
  iconColor: string;
  backContent: React.ReactNode;
}

export function FlipCard({
  step,
  title,
  description,
  icon,
  color,
  lightColor,
  iconColor,
  backContent,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card-container cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`flip-card-inner ${flipped ? 'flip-card-flipped' : ''}`}>
        {/* ═══ FRONT ═══ */}
        <div className="flip-card-face flip-card-front bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className={`${lightColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
              {icon}
            </div>
            <span className={`${color} text-white text-sm font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg`}>
              {step}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
          <p className="text-xs text-gray-400 mt-4 font-medium">Tap to see example →</p>
        </div>

        {/* ═══ BACK ═══ */}
        <div className={`flip-card-face flip-card-back rounded-2xl p-7 sm:p-8 border border-gray-100 shadow-lg ${color} text-white`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wide">Step {step}</span>
          </div>
          <div className="flex-1">{backContent}</div>
        </div>
      </div>
    </div>
  );
}
