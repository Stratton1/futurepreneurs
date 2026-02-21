'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SafetyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  lightBg: string;
  iconColor: string;
  details: string[];
}

export function SafetyCard({
  icon,
  title,
  description,
  color,
  lightBg,
  iconColor,
  details,
}: SafetyCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Colored top bar on hover */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="p-8">
        <div className={`${lightBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${expanded ? 'animate-pulse-soft' : ''}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>

        {/* Expand indicator */}
        <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-gray-400">
          <span>Tap to learn more</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expandable detail panel */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: expanded ? '300px' : '0px' }}
      >
        <div className={`${lightBg} px-8 pb-6 pt-4 border-t border-gray-100`}>
          <ul className="space-y-2.5">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className={`${iconColor} mt-0.5 text-base leading-none`}>✓</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
