'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resolveReport, dismissReport, removeProject } from './actions';
import { Check, X, Trash2 } from 'lucide-react';

interface AdminReportActionsProps {
  reportId: string;
  projectId: string;
}

export function AdminReportActions({ reportId, projectId }: AdminReportActionsProps) {
  const [loading, setLoading] = useState<'resolve' | 'dismiss' | 'remove' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRemove, setShowRemove] = useState(false);

  async function handleResolve() {
    setError(null);
    setLoading('resolve');
    const result = await resolveReport(reportId);
    setLoading(null);
    if (result.error) setError(result.error);
  }

  async function handleDismiss() {
    setError(null);
    setLoading('dismiss');
    const result = await dismissReport(reportId);
    setLoading(null);
    if (result.error) setError(result.error);
  }

  async function handleRemove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading('remove');
    const form = e.currentTarget;
    const reason = (form.elements.namedItem('reason') as HTMLInputElement)?.value?.trim();
    const result = await removeProject(projectId, reason || undefined);
    setLoading(null);
    setShowRemove(false);
    if (result.error) setError(result.error);
  }

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      {error && <p className="text-sm text-red-600 text-right w-full">{error}</p>}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResolve}
          disabled={loading !== null}
        >
          <Check className="h-4 w-4 mr-1" />
          Resolve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDismiss}
          disabled={loading !== null}
        >
          <X className="h-4 w-4 mr-1" />
          Dismiss
        </Button>
        {!showRemove ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRemove(true)}
            disabled={loading !== null}
            className="text-amber-700 border-amber-200 hover:bg-amber-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove project
          </Button>
        ) : (
          <form onSubmit={handleRemove} className="flex flex-col gap-2 items-end">
            <input
              type="text"
              name="reason"
              placeholder="Reason (optional)"
              className="rounded border border-gray-300 px-2 py-1 text-sm w-48"
            />
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowRemove(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm" disabled={loading === 'remove'}>
                Confirm remove
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
