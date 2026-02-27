'use client';

import { useState } from 'react';
import { updateDigestSettings } from './actions';
import { Mail } from 'lucide-react';

interface DigestSettingsProps {
  initialEnabled: boolean;
  initialDay: string;
}

const DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
] as const;

export function DigestSettings({ initialEnabled, initialDay }: DigestSettingsProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [day, setDay] = useState(initialDay);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const formData = new FormData();
    formData.set('digest_enabled', String(enabled));
    formData.set('digest_day', day);

    const result = await updateDigestSettings(formData);
    setSaving(false);

    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">Weekly Digest</h3>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">
            Send me a weekly summary email
          </span>
        </label>

        {enabled && (
          <div className="ml-7">
            <label className="text-xs text-gray-500 block mb-1">Send every</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 transition-colors"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}
