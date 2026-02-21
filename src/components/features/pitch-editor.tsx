'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, Check, Sparkles } from 'lucide-react';

interface PitchEditorProps {
  pitch: string;
  isAiGenerated: boolean;
  onSave: (editedPitch: string) => Promise<void>;
  onApply: () => Promise<void>;
  applied: boolean;
}

export function PitchEditor({ pitch, isAiGenerated, onSave, onApply, applied }: PitchEditorProps) {
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(pitch);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(editedText);
    setSaving(false);
    setEditing(false);
  };

  const handleApply = async () => {
    setApplying(true);
    await onApply();
    setApplying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAiGenerated && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3" /> AI-generated
            </span>
          )}
          {applied && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              <Check className="h-3 w-3" /> Applied to project
            </span>
          )}
        </div>
        {!editing && !applied && (
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Edit3 className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <Textarea
            id="pitchEdit"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={10}
            hint="Edit the pitch to make it your own. Minimum 50 characters."
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              isLoading={saving}
              disabled={editedText.trim().length < 50}
            >
              Save Edits
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {editedText || pitch}
        </div>
      )}

      {!applied && !editing && (
        <Button
          type="button"
          onClick={handleApply}
          isLoading={applying}
          className="w-full"
        >
          <Check className="h-4 w-4 mr-1" /> Apply This Pitch to My Project
        </Button>
      )}
    </div>
  );
}
