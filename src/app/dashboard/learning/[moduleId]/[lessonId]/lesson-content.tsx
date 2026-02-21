'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizSection } from '@/components/features/quiz-section';
import { TaskChecklist } from '@/components/features/task-checklist';
import { markLessonComplete, submitQuizAnswers, toggleTaskComplete } from '@/app/dashboard/learning/actions';
import type { QuizQuestion as QuizQuestionType, LessonTask } from '@/types/learning';

interface LessonContentProps {
  moduleId: string;
  lessonId: string;
  content: string;
  quiz: QuizQuestionType[] | null;
  tasks: LessonTask[] | null;
  completedTaskIds: string[];
  alreadyCompleted: boolean;
}

/** Simple markdown-like renderer for lesson content */
function renderContent(markdown: string) {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;
    const headerRow = tableRows[0];
    const bodyRows = tableRows.slice(2);
    elements.push(
      <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headerRow.map((cell, i) => (
                <th key={i} className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gray-200 px-3 py-2 text-gray-600">
                    {cell.trim().replace(/\*\*(.*?)\*\*/g, '$1')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-3 text-gray-700">
        {listItems.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
        ))}
      </ul>
    );
    listItems = [];
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('|')) {
      if (!inTable) {
        if (inList) { inList = false; flushList(); }
        inTable = true;
      }
      const cells = trimmed.split('|').filter((c) => c.trim() !== '');
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      if (!inList) inList = true;
      const itemText = trimmed.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
      listItems.push(itemText);
      continue;
    } else if (inList) {
      inList = false;
      flushList();
    }

    if (/^- \[[ x]\]/.test(trimmed)) {
      const checked = trimmed.startsWith('- [x]');
      const text = trimmed.replace(/^- \[[ x]\]\s*/, '');
      elements.push(
        <div key={`check-${elements.length}`} className="flex items-center gap-2 my-1 text-gray-700">
          <input type="checkbox" defaultChecked={checked} className="rounded" />
          <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="border-l-4 border-emerald-300 bg-emerald-50 px-4 py-3 my-3 text-gray-700 italic"
          dangerouslySetInnerHTML={{ __html: formatInline(quoteText) }}
        />
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-lg font-semibold text-gray-900 mt-6 mb-2">
          {trimmed.replace('### ', '')}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {trimmed.replace('## ', '')}
        </h2>
      );
      continue;
    }

    if (trimmed === '') continue;

    elements.push(
      <p
        key={`p-${elements.length}`}
        className="text-gray-700 my-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  }

  if (inTable) flushTable();
  if (inList) flushList();

  return elements;
}

export function LessonContent({ moduleId, lessonId, content, quiz, tasks, completedTaskIds, alreadyCompleted }: LessonContentProps) {
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [markingComplete, setMarkingComplete] = useState(false);

  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    await markLessonComplete(moduleId, lessonId);
    setCompleted(true);
    setMarkingComplete(false);
  };

  const handleQuizComplete = async (answers: number[]) => {
    const result = await submitQuizAnswers(moduleId, lessonId, answers);
    if ('error' in result && result.error) return null;
    setCompleted(true);
    return result as { correctCount: number; totalQuestions: number; results: { isCorrect: boolean; explanation: string }[] };
  };

  const handleTaskToggle = async (taskId: string) => {
    await toggleTaskComplete(moduleId, lessonId, taskId);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        {renderContent(content)}
      </div>

      {/* Tasks section */}
      {tasks && tasks.length > 0 && (
        <div className="mt-6">
          <TaskChecklist
            tasks={tasks}
            completedTaskIds={new Set(completedTaskIds)}
            moduleId={moduleId}
            lessonId={lessonId}
            onToggle={handleTaskToggle}
          />
        </div>
      )}

      {/* Quiz section */}
      {quiz && quiz.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Quiz — {quiz.length} question{quiz.length !== 1 ? 's' : ''}
          </h2>
          <QuizSection
            quiz={quiz}
            moduleId={moduleId}
            lessonId={lessonId}
            onAllComplete={handleQuizComplete}
            alreadyCompleted={alreadyCompleted}
          />
        </div>
      )}

      {/* Mark complete button (only for lessons without quizzes) */}
      {(!quiz || quiz.length === 0) && !completed && (
        <div className="mt-6 text-center">
          <Button
            variant="primary"
            onClick={handleMarkComplete}
            disabled={markingComplete}
          >
            {markingComplete ? 'Saving...' : 'Mark as Complete'}
          </Button>
        </div>
      )}

      {completed && (!quiz || quiz.length === 0) && (
        <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Lesson completed!</span>
        </div>
      )}
    </div>
  );
}
