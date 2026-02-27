'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createProjectUpdate } from '../actions';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

const UPDATE_TYPES = [
  { value: 'general', label: 'General Update' },
  { value: 'impact_report', label: 'Impact Report' },
  { value: 'milestone_complete', label: 'Milestone Complete' },
  { value: 'thank_you', label: 'Thank You' },
];

export default function NewUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [updateType, setUpdateType] = useState('general');
  const [learnings, setLearnings] = useState('');
  const [fundsBreakdown, setFundsBreakdown] = useState<{ label: string; amount: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addBreakdownRow() {
    setFundsBreakdown([...fundsBreakdown, { label: '', amount: '' }]);
  }

  function removeBreakdownRow(index: number) {
    setFundsBreakdown(fundsBreakdown.filter((_, i) => i !== index));
  }

  function updateBreakdownRow(index: number, field: 'label' | 'amount', value: string) {
    const updated = [...fundsBreakdown];
    updated[index] = { ...updated[index], [field]: value };
    setFundsBreakdown(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const parsedBreakdown = fundsBreakdown
      .filter((row) => row.label.trim() && Number(row.amount) > 0)
      .map((row) => ({ label: row.label.trim(), amount: Number(row.amount) }));

    const result = await createProjectUpdate({
      projectId,
      title,
      content,
      updateType,
      images: [],
      fundsBreakdown: parsedBreakdown.length > 0 ? parsedBreakdown : null,
      learnings: learnings.trim() || null,
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/dashboard/projects/${projectId}/updates`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/dashboard/projects/${projectId}/updates`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Post an Update</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* Update type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type of update
          </label>
          <div className="flex flex-wrap gap-2">
            {UPDATE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setUpdateType(type.value)}
                className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                  updateType === type.value
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="e.g. We reached 50% funded!"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Update content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={5000}
            rows={6}
            placeholder="Tell your backers what's been happening..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{content.length}/5000</p>
        </div>

        {/* Funds breakdown (optional) */}
        {(updateType === 'impact_report' || updateType === 'milestone_complete') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you spend the funds? (optional)
            </label>
            {fundsBreakdown.map((row, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={row.label}
                  onChange={(e) => updateBreakdownRow(i, 'label', e.target.value)}
                  placeholder="e.g. Materials"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) => updateBreakdownRow(i, 'amount', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-28 border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeBreakdownRow(i)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBreakdownRow}
              className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </div>
        )}

        {/* Learnings (optional) */}
        <div>
          <label htmlFor="learnings" className="block text-sm font-medium text-gray-700 mb-1">
            What did you learn? (optional)
          </label>
          <textarea
            id="learnings"
            value={learnings}
            onChange={(e) => setLearnings(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Share what you've learned so far..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Your teacher will review this update before it goes live
          </p>
          <button
            type="submit"
            disabled={submitting || !title.trim() || !content.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
