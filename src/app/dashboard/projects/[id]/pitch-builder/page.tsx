'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { PitchEditor } from '@/components/features/pitch-editor';
import { generateAndSavePitch, saveEdits, applyPitchToProject } from './actions';
import { ArrowLeft, ArrowRight, Sparkles, Lightbulb } from 'lucide-react';
import type { PitchAnswers } from '@/lib/ai/pitch-builder';

const STEPS = [
  {
    key: 'problem' as const,
    title: 'What problem does your business solve?',
    hint: 'Think about what frustrates people or what they need. Why does your business idea matter?',
    placeholder: 'e.g., My school doesn\'t have healthy snack options at break time...',
  },
  {
    key: 'solution' as const,
    title: 'What\'s your solution?',
    hint: 'Describe what you\'re building or offering. How does it fix the problem?',
    placeholder: 'e.g., I make fresh fruit smoothies using local ingredients...',
  },
  {
    key: 'audience' as const,
    title: 'Who is your audience?',
    hint: 'Who will buy from you or benefit from your project?',
    placeholder: 'e.g., Students at my school and parents who want healthy options for their kids...',
  },
  {
    key: 'fundsUsage' as const,
    title: 'What do you need the funds for?',
    hint: 'Be specific about how you\'ll spend the money. This builds trust with backers.',
    placeholder: 'e.g., I need £200 for a blender, £50 for cups and straws, and £100 for ingredients...',
  },
  {
    key: 'uniqueness' as const,
    title: 'What makes you unique?',
    hint: 'What sets your idea apart? Why should someone back YOUR project?',
    placeholder: 'e.g., I\'m the only student in my school doing this, and I donate 10% to our school garden...',
  },
];

interface DraftData {
  id: string;
  answers: PitchAnswers;
  generated_pitch: string | null;
  edited_pitch: string | null;
  is_applied: boolean;
}

export default function PitchBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PitchAnswers>({
    problem: '',
    solution: '',
    audience: '',
    fundsUsage: '',
    uniqueness: '',
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Generated pitch state
  const [pitch, setPitch] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Load existing draft
  const [loading, setLoading] = useState(true);

  const loadDraft = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/pitch-draft`);
      if (res.ok) {
        const data: DraftData = await res.json();
        if (data) {
          setAnswers(data.answers);
          setPitch(data.edited_pitch || data.generated_pitch);
          setDraftId(data.id);
          setIsApplied(data.is_applied);
          if (data.generated_pitch) {
            setStep(5); // Show the review step
          }
        }
      }
    } catch {
      // No draft found, start fresh
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    const t = setTimeout(() => { loadDraft(); }, 0);
    return () => clearTimeout(t);
  }, [loadDraft]);

  const currentStep = STEPS[step];
  const currentAnswer = currentStep ? answers[currentStep.key] : '';
  const canAdvance = currentAnswer.trim().length >= 10;

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    const result = await generateAndSavePitch(projectId, answers);
    if (result.error) {
      setError(result.error);
    } else if (result.pitch) {
      setPitch(result.pitch);
      setDraftId(result.draftId ?? null);
      setIsAiGenerated(result.isAiGenerated ?? false);
      setStep(5);
    }
    setGenerating(false);
  };

  const handleSaveEdits = async (editedPitch: string) => {
    if (!draftId) return;
    setError(null);
    const result = await saveEdits(projectId, draftId, editedPitch);
    if (result.error) {
      setError(result.error);
    } else {
      setPitch(editedPitch);
      setSuccess('Edits saved!');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleApply = async () => {
    if (!draftId) return;
    setError(null);
    const result = await applyPitchToProject(projectId, draftId);
    if (result.error) {
      setError(result.error);
    } else {
      setIsApplied(true);
      setSuccess('Pitch applied to your project description!');
      setTimeout(() => router.push(`/dashboard/projects/${projectId}/edit`), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" /> Pitch Builder
          </h1>
          <p className="text-gray-600 mt-1">Answer 5 questions and we&apos;ll help write your campaign pitch.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-emerald-500' : i === step && step < 5 ? 'bg-emerald-300' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Wizard Steps */}
      {step < 5 && currentStep && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Step {step + 1} of 5: {currentStep.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{currentStep.hint}</p>
            </div>
          </div>

          <Textarea
            id={`pitch-${currentStep.key}`}
            value={currentAnswer}
            onChange={(e) => setAnswers({ ...answers, [currentStep.key]: e.target.value })}
            placeholder={currentStep.placeholder}
            rows={4}
            hint="Minimum 10 characters"
          />

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canAdvance}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleGenerate}
                isLoading={generating}
                disabled={!canAdvance}
              >
                <Sparkles className="h-4 w-4 mr-1" /> Generate My Pitch
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Review Step */}
      {step === 5 && pitch && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Your Campaign Pitch</h2>
          <p className="text-sm text-gray-500">
            Review and edit your pitch below. When you&apos;re happy with it, apply it to your project.
          </p>

          <PitchEditor
            pitch={pitch}
            isAiGenerated={isAiGenerated}
            onSave={handleSaveEdits}
            onApply={handleApply}
            applied={isApplied}
          />

          {!isApplied && (
            <div className="pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(0)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Start Over
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
