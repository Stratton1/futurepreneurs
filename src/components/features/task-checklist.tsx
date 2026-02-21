'use client';

import { useState, useTransition } from 'react';
import { CheckCircle, Circle, Download, Search, PenLine, Dumbbell } from 'lucide-react';
import type { LessonTask } from '@/types/learning';

interface TaskChecklistProps {
  tasks: LessonTask[];
  completedTaskIds: Set<string>;
  moduleId: string;
  lessonId: string;
  onToggle: (taskId: string) => Promise<void>;
}

const typeConfig: Record<LessonTask['type'], { icon: typeof PenLine; label: string; bg: string; border: string; text: string }> = {
  reflection: { icon: PenLine, label: 'Reflection', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  research: { icon: Search, label: 'Research', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  exercise: { icon: Dumbbell, label: 'Exercise', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  download: { icon: Download, label: 'Download', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
};

export function TaskChecklist({ tasks, completedTaskIds, onToggle }: TaskChecklistProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedTaskIds));
  const [pending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = (taskId: string) => {
    setTogglingId(taskId);
    const next = new Set(completed);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    setCompleted(next);

    startTransition(async () => {
      await onToggle(taskId);
      setTogglingId(null);
    });
  };

  const completedCount = completed.size;
  const totalCount = tasks.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Tasks</h3>
        <span className="text-sm text-gray-500">
          {completedCount}/{totalCount} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const isCompleted = completed.has(task.id);
          const isToggling = togglingId === task.id;
          const config = typeConfig[task.type];
          const Icon = config.icon;

          return (
            <div
              key={task.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isCompleted
                  ? 'bg-gray-50 border-gray-200'
                  : `${config.bg} ${config.border}`
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggle(task.id)}
                  disabled={pending && isToggling}
                  className="mt-0.5 flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className={`h-5 w-5 ${config.text} opacity-60`} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-3.5 w-3.5 ${isCompleted ? 'text-gray-400' : config.text}`} />
                    <span className={`text-xs font-medium ${isCompleted ? 'text-gray-400' : config.text}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className={`font-medium text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <p className={`text-sm mt-0.5 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                  {task.type === 'download' && task.downloadUrl && (
                    <a
                      href={task.downloadUrl}
                      download
                      className={`inline-flex items-center gap-1.5 mt-2 text-sm font-medium ${
                        isCompleted ? 'text-gray-400' : 'text-amber-700 hover:text-amber-800'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
