import Link from 'next/link';
import { Lightbulb, PenLine, Megaphone, PiggyBank, CheckCircle } from 'lucide-react';
import type { LearningModule } from '@/types/learning';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  PenLine,
  Megaphone,
  PiggyBank,
};

const COLOUR_CLASSES: Record<string, { bg: string; iconBg: string; iconText: string; progress: string }> = {
  amber: { bg: 'bg-amber-50 hover:bg-amber-100', iconBg: 'bg-amber-100', iconText: 'text-amber-700', progress: 'bg-amber-500' },
  blue: { bg: 'bg-blue-50 hover:bg-blue-100', iconBg: 'bg-blue-100', iconText: 'text-blue-700', progress: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50 hover:bg-purple-100', iconBg: 'bg-purple-100', iconText: 'text-purple-700', progress: 'bg-purple-500' },
  emerald: { bg: 'bg-emerald-50 hover:bg-emerald-100', iconBg: 'bg-emerald-100', iconText: 'text-emerald-700', progress: 'bg-emerald-500' },
};

interface LearningModuleCardProps {
  module: LearningModule;
  completedCount: number;
}

export function LearningModuleCard({ module, completedCount }: LearningModuleCardProps) {
  const Icon = ICONS[module.icon] ?? Lightbulb;
  const colours = COLOUR_CLASSES[module.colour] ?? COLOUR_CLASSES.emerald;
  const totalLessons = module.lessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const isComplete = completedCount >= totalLessons;

  return (
    <Link
      href={`/learn/${module.id}`}
      className={`block rounded-2xl p-6 transition-colors ${colours.bg}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${colours.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-6 w-6 ${colours.iconText}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
            {isComplete && (
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{completedCount} of {totalLessons} lessons</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colours.progress}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
