'use client';

import { AnimateIn } from './animate-in';
import { AnimatedCounter } from './animated-counter';
import type { ElementType } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: ElementType;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'gray';
  delay?: number;
  href?: string;
  className?: string;
}

const iconColors: Record<string, string> = {
  emerald: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100',
  blue: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100',
  purple: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100',
  amber: 'text-amber-600 bg-amber-50 group-hover:bg-amber-100',
  rose: 'text-rose-600 bg-rose-50 group-hover:bg-rose-100',
  gray: 'text-gray-600 bg-gray-50 group-hover:bg-gray-100',
};

const borderColors: Record<string, string> = {
  emerald: 'hover:border-emerald-200',
  blue: 'hover:border-blue-200',
  purple: 'hover:border-purple-200',
  amber: 'hover:border-amber-200',
  rose: 'hover:border-rose-200',
  gray: 'hover:border-gray-300',
};

export function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  color = 'emerald',
  delay = 0,
  className = '',
}: StatCardProps) {
  return (
    <AnimateIn animation="fade-up" delay={delay}>
      <div
        className={`group bg-white rounded-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${borderColors[color]} ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 transition-colors duration-300 ${iconColors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">
              <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}
