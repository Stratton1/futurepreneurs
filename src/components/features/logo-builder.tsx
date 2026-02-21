'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogoPreview } from './logo-preview';
import {
  LOGO_TEMPLATES,
  LOGO_PALETTES,
  LOGO_ICONS,
  type LogoConfig,
} from '@/lib/logo-templates';
import { Save, RotateCcw } from 'lucide-react';

interface LogoBuilderProps {
  initialConfig?: LogoConfig | null;
  onSave: (config: LogoConfig) => Promise<void>;
  disabled?: boolean;
}

const DEFAULT_CONFIG: LogoConfig = {
  templateId: 'circle',
  paletteId: 'emerald',
  iconId: 'rocket',
  businessName: '',
  fontSize: 16,
};

export function LogoBuilder({ initialConfig, onSave, disabled = false }: LogoBuilderProps) {
  const [config, setConfig] = useState<LogoConfig>(initialConfig ?? DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);

  const update = (partial: Partial<LogoConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(config);
    setSaving(false);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview */}
      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 min-h-[300px]">
        <LogoPreview config={config} size={200} />
        <p className="text-xs text-gray-400 mt-4">Preview of your logo</p>
      </div>

      {/* Controls */}
      <div className="space-y-5">
        {/* Business Name */}
        <div>
          <Input
            label="Business Name"
            id="logoBusinessName"
            value={config.businessName}
            onChange={(e) => update({ businessName: e.target.value.slice(0, 20) })}
            placeholder="e.g. Sarah's Candles"
            hint="Max 20 characters"
            disabled={disabled}
          />
        </div>

        {/* Shape */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
          <div className="grid grid-cols-4 gap-2">
            {LOGO_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => update({ templateId: t.id })}
                className={`p-2 rounded-lg border-2 text-xs font-medium transition-colors ${
                  config.templateId === t.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colour */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Colour</label>
          <div className="flex flex-wrap gap-2">
            {LOGO_PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                disabled={disabled}
                onClick={() => update({ paletteId: p.id })}
                title={p.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  config.paletteId === p.id
                    ? 'border-gray-800 scale-110'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{ backgroundColor: p.primary }}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
            {LOGO_ICONS.map((ic) => (
              <button
                key={ic.id}
                type="button"
                disabled={disabled}
                onClick={() => update({ iconId: ic.id })}
                className={`p-2 rounded-lg border-2 text-xs font-medium transition-colors text-center ${
                  config.iconId === ic.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {ic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label htmlFor="logoFontSize" className="block text-sm font-medium text-gray-700 mb-1">
            Text Size: {config.fontSize}px
          </label>
          <input
            id="logoFontSize"
            type="range"
            min={10}
            max={24}
            value={config.fontSize}
            disabled={disabled}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="w-full accent-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={disabled || saving}
          >
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            disabled={disabled || saving}
          >
            <Save className="h-4 w-4 mr-1" /> Save Logo
          </Button>
        </div>
      </div>
    </div>
  );
}
