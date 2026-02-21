interface LessonProgressBarProps {
  completed: number;
  total: number;
  colour?: string;
}

const PROGRESS_COLOURS: Record<string, string> = {
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
};

export function LessonProgressBar({ completed, total, colour = 'emerald' }: LessonProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const barColour = PROGRESS_COLOURS[colour] ?? PROGRESS_COLOURS.emerald;

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
        <span>{completed} of {total} lessons complete</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColour}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
