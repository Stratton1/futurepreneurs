'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSponsor } from './actions';

export function CreateSponsorForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sponsorType, setSponsorType] = useState<'corporate' | 'grant'>('corporate');
  const [matchRatio, setMatchRatio] = useState('1');
  const [maxPerProject, setMaxPerProject] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await createSponsor({
      name: name.trim(),
      description: description.trim() || null,
      sponsorType,
      matchRatio: Number(matchRatio),
      maxMatchPerProject: Number(maxPerProject),
      totalBudget: Number(totalBudget),
      contactEmail: contactEmail.trim() || null,
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setName('');
      setDescription('');
      setMatchRatio('1');
      setMaxPerProject('');
      setTotalBudget('');
      setContactEmail('');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sp-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="sp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Acme Corp"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="sp-type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="sp-type"
            value={sponsorType}
            onChange={(e) => setSponsorType(e.target.value as 'corporate' | 'grant')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="corporate">Corporate Sponsor</option>
            <option value="grant">Youth Grant Programme</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sp-desc" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="sp-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sp-ratio" className="block text-sm font-medium text-gray-700 mb-1">
            Match ratio
          </label>
          <input
            id="sp-ratio"
            type="number"
            value={matchRatio}
            onChange={(e) => setMatchRatio(e.target.value)}
            required
            min="0.1"
            max="10"
            step="0.1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-400 mt-0.5">e.g. 1 = 1:1 match</p>
        </div>

        <div>
          <label htmlFor="sp-max" className="block text-sm font-medium text-gray-700 mb-1">
            Max per project (£)
          </label>
          <input
            id="sp-max"
            type="number"
            value={maxPerProject}
            onChange={(e) => setMaxPerProject(e.target.value)}
            required
            min="1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="sp-budget" className="block text-sm font-medium text-gray-700 mb-1">
            Total budget (£)
          </label>
          <input
            id="sp-budget"
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            required
            min="1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sp-email" className="block text-sm font-medium text-gray-700 mb-1">
          Contact email (optional)
        </label>
        <input
          id="sp-email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !name.trim() || !maxPerProject || !totalBudget}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {submitting ? 'Creating...' : 'Create Sponsor'}
      </button>
    </form>
  );
}
