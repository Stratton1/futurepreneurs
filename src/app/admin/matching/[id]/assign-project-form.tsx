'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignSponsorToProject } from '../actions';

export function AssignProjectForm({ sponsorId }: { sponsorId: string }) {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await assignSponsorToProject(sponsorId, projectId.trim());

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setProjectId('');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-sm">
          Sponsor assigned to project successfully.
        </div>
      )}

      <div>
        <label htmlFor="project-id" className="block text-sm font-medium text-gray-700 mb-1">
          Project ID
        </label>
        <input
          id="project-id"
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          placeholder="Paste the project UUID"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          You can find project IDs in the admin projects list.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || !projectId.trim()}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {submitting ? 'Assigning...' : 'Assign'}
      </button>
    </form>
  );
}
