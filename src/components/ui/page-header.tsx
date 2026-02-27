'use client';

import { AnimateIn } from './animate-in';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode, ElementType } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  icon?: ElementType;
  accent?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  actions?: ReactNode;
  className?: string;
}

const accentGradients: Record<string, string> = {
  emerald: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  blue: 'from-blue-500/10 via-sky-500/5 to-transparent',
  purple: 'from-purple-500/10 via-violet-500/5 to-transparent',
  amber: 'from-amber-500/10 via-orange-500/5 to-transparent',
  rose: 'from-rose-500/10 via-pink-500/5 to-transparent',
};

const accentColors: Record<string, string> = {
  emerald: 'text-emerald-600 bg-emerald-100',
  blue: 'text-blue-600 bg-blue-100',
  purple: 'text-purple-600 bg-purple-100',
  amber: 'text-amber-600 bg-amber-100',
  rose: 'text-rose-600 bg-rose-100',
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  icon: Icon,
  accent = 'emerald',
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${accentGradients[accent]} border border-gray-100 p-6 sm:p-8 mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <AnimateIn animation="fade-in" className="mb-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-gray-700 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </AnimateIn>
      )}

      <div className="flex items-start justify-between gap-4">
        <AnimateIn animation="fade-up" className="flex items-center gap-3">
          {Icon && (
            <div className={`rounded-xl p-2.5 ${accentColors[accent]}`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-500 mt-1 text-sm sm:text-base">{description}</p>
            )}
          </div>
        </AnimateIn>

        {actions && (
          <AnimateIn animation="fade-in" delay={200} className="shrink-0">
            {actions}
          </AnimateIn>
        )}
      </div>
    </div>
  );
}
