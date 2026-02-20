'use client';

import { useState } from 'react';
import { AvatarDisplay } from './avatar-display';
import { Button } from '@/components/ui/button';
import { updateAvatarConfig } from '@/app/dashboard/profile/actions';
import type { AvatarConfig } from '@/types/database';

const HAIR_STYLES = [
  { value: 'short', label: 'Short' },
  { value: 'long', label: 'Long' },
  { value: 'curly', label: 'Curly' },
];

const HAIR_COLORS = [
  { value: 'brown', label: 'Brown' },
  { value: 'black', label: 'Black' },
  { value: 'blonde', label: 'Blonde' },
];

const SKIN_TONES = [
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'dark', label: 'Dark' },
];

const ACCESSORIES = [
  { value: 'glasses', label: 'Glasses' },
  { value: 'hat', label: 'Hat' },
];

interface AvatarBuilderProps {
  initialConfig: AvatarConfig | null;
  onSaved?: () => void;
}

export function AvatarBuilder({ initialConfig, onSaved }: AvatarBuilderProps) {
  const [config, setConfig] = useState<AvatarConfig>({
    hairStyle: initialConfig?.hairStyle ?? 'short',
    hairColor: initialConfig?.hairColor ?? 'brown',
    skinTone: initialConfig?.skinTone ?? 'medium',
    accessories: initialConfig?.accessories ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAccessory = (value: string) => {
    const current = config.accessories ?? [];
    const next = current.includes(value)
      ? current.filter((a) => a !== value)
      : [...current, value];
    setConfig({ ...config, accessories: next });
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    const result = await updateAvatarConfig(config);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <AvatarDisplay avatarConfig={config} size="lg" className="flex-shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hair style</label>
            <div className="flex flex-wrap gap-2">
              {HAIR_STYLES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfig({ ...config, hairStyle: opt.value })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    config.hairStyle === opt.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hair colour</label>
            <div className="flex flex-wrap gap-2">
              {HAIR_COLORS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfig({ ...config, hairColor: opt.value })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    config.hairColor === opt.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skin tone</label>
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setConfig({ ...config, skinTone: opt.value })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    config.skinTone === opt.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accessories</label>
            <div className="flex flex-wrap gap-2">
              {ACCESSORIES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleAccessory(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (config.accessories ?? []).includes(opt.value)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button onClick={handleSave} disabled={saving} isLoading={saving}>
        Save avatar
      </Button>
    </div>
  );
}
