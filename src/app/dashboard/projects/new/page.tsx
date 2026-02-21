'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/image-upload';
import { PROJECT_CATEGORIES, MAX_FUNDING_GOAL, CURRENCY_SYMBOL } from '@/lib/constants';
import { createProject } from '../actions';
import { ArrowLeft, ArrowRight, Plus, Trash2, Rocket, User, Users } from 'lucide-react';
import { GuidedTip } from '@/components/features/guided-tip';

interface MilestoneInput {
  title: string;
  description: string;
  amount: number;
}

const STEPS = [
  { label: 'Basics' },
  { label: 'Details' },
  { label: 'Funding' },
  { label: 'Milestones' },
  { label: 'Mentor' },
  { label: 'Review' },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [projectType, setProjectType] = useState<'individual' | 'group'>('individual');
  const [groupName, setGroupName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: '', description: '', amount: 0 },
  ]);
  const [mentorId, setMentorId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorSearchError, setMentorSearchError] = useState('');
  const [mentorSearching, setMentorSearching] = useState(false);
  const [teachers, setTeachers] = useState<{ id: string; full_name: string }[]>([]);
  const [teachersLoaded, setTeachersLoaded] = useState(false);

  // Load teachers when reaching mentor step
  const loadTeachers = async () => {
    if (teachersLoaded) return;
    try {
      const res = await fetch('/api/teachers');
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.teachers || []);
      }
    } catch {
      // Teachers will be empty, user will see a message
    }
    setTeachersLoaded(true);
  };

  const findTeacherByEmail = async () => {
    if (!mentorEmail.trim()) return;
    setMentorSearching(true);
    setMentorSearchError('');
    try {
      const res = await fetch('/api/teachers/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mentorEmail.trim() }),
      });
      const data = await res.json();
      if (data.found) {
        setMentorId(data.teacher.id);
        setMentorName(data.teacher.full_name);
        setMentorSearchError('');
      } else {
        setMentorSearchError(data.error || 'Teacher not found');
      }
    } catch {
      setMentorSearchError('Something went wrong. Please try again.');
    }
    setMentorSearching(false);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', amount: 0 }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const milestoneTotal = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const goalNum = Number(goalAmount) || 0;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return title.trim().length >= 3 && category !== '' && shortDescription.trim().length >= 10;
      case 1: return description.trim().length >= 50;
      case 2: return goalNum > 0 && goalNum <= MAX_FUNDING_GOAL;
      case 3: return milestones.every(m => m.title.trim() && m.amount > 0) && Math.abs(milestoneTotal - goalNum) < 0.01;
      case 4: return true; // Mentor is optional — can be added later
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step === 4 && !teachersLoaded) loadTeachers();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      if (step + 1 === 4 && !teachersLoaded) loadTeachers();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const result = await createProject({
      title,
      shortDescription,
      description,
      category,
      goalAmount: goalNum,
      videoUrl: videoUrl || undefined,
      images,
      milestones: milestones.map(m => ({
        ...m,
        amount: Number(m.amount),
      })),
      mentorId: mentorId || undefined,
      projectType,
      groupName: projectType === 'group' ? groupName : undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/dashboard/projects'), 2000);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-emerald-50 rounded-2xl p-8">
          <Rocket className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Created!</h2>
          <p className="text-gray-600">
            Your project has been saved as a draft. You can review it and submit it for teacher verification when you&apos;re ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Project</h1>
      <p className="text-gray-600 mb-6">Tell us about your business idea and how much you need to get started.</p>

      <ProgressSteps steps={STEPS} currentStep={step} className="mb-8" />

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Step 0: Basics */}
      {step === 0 && (
        <div className="space-y-5">
          <GuidedTip
            title="Why a good title matters"
            body="Your title is the first thing people see. A catchy, clear title helps supporters instantly understand your idea and makes them want to learn more. Think about what makes your project special!"
            learnMoreHref="/learn/pitch-writing/hook-your-audience"
            learnMoreLabel="Learn about hooks"
          />
          <Input
            label="Project Title"
            id="title"
            placeholder="e.g., Sarah's Homemade Candles"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            hint="Give your project a catchy name (at least 3 characters)"
          />
          <Select
            label="Category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Pick a category"
            options={PROJECT_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Textarea
            label="Short Description"
            id="shortDescription"
            placeholder="Describe your project in a sentence or two..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            hint="This appears on project cards. Keep it snappy! (at least 10 characters)"
            rows={2}
          />

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setProjectType('individual'); setGroupName(''); }}
                className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${
                  projectType === 'individual'
                    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${projectType === 'individual' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <User className={`h-5 w-5 ${projectType === 'individual' ? 'text-emerald-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${projectType === 'individual' ? 'text-emerald-700' : 'text-gray-700'}`}>Solo Project</p>
                    <p className="text-xs text-gray-500 mt-0.5">Just you — your own business idea</p>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProjectType('group')}
                className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${
                  projectType === 'group'
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${projectType === 'group' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Users className={`h-5 w-5 ${projectType === 'group' ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${projectType === 'group' ? 'text-blue-700' : 'text-gray-700'}`}>Group / Club</p>
                    <p className="text-xs text-gray-500 mt-0.5">Team up with classmates</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          {projectType === 'group' && (
            <div className="space-y-3">
              <Input
                label="Group / Club Name"
                id="groupName"
                placeholder="e.g., Year 10 Entrepreneurs Club"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                hint="Give your team a name — you can invite members after creating the project"
              />
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <strong>Group projects</strong> let you invite other students from your school to collaborate. You&apos;ll be able to manage your team from the project dashboard after creating it.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-5">
          <GuidedTip
            title="How to write a great description"
            body="Tell your story! Explain why you started this project, what problem it solves, and how the funds will help. The best descriptions are honest, personal, and show your passion."
            learnMoreHref="/learn/pitch-writing/tell-your-story"
            learnMoreLabel="Learn about storytelling"
          />
          <Textarea
            label="Full Description"
            id="description"
            placeholder="Tell people all about your project. What's your idea? Why are you excited about it? What will you do with the funding?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            hint="The more detail, the better. This is your pitch! (at least 50 characters)"
            rows={8}
          />
          <ImageUpload
            label="Project Images (optional)"
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
          <Input
            label="Video URL (optional)"
            id="videoUrl"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            hint="Got a video pitch? Paste a YouTube or Vimeo link."
          />
        </div>
      )}

      {/* Step 2: Funding */}
      {step === 2 && (
        <div className="space-y-5">
          <GuidedTip
            title="How to set a realistic goal"
            body="Think carefully about exactly how much money you need. Research the costs of materials, tools, and anything else your project requires. A realistic goal builds trust with supporters!"
            learnMoreHref="/learn/business-plan/setting-goals"
            learnMoreLabel="Learn about goal setting"
          />
          <Input
            label={`Funding Goal (${CURRENCY_SYMBOL})`}
            id="goalAmount"
            type="number"
            min="1"
            max={MAX_FUNDING_GOAL}
            step="0.01"
            placeholder="e.g., 500"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            hint={`How much do you need? Maximum ${CURRENCY_SYMBOL}${MAX_FUNDING_GOAL.toLocaleString()}`}
            error={goalNum > MAX_FUNDING_GOAL ? `Maximum is ${CURRENCY_SYMBOL}${MAX_FUNDING_GOAL.toLocaleString()}` : undefined}
          />
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
            <strong>How funding works:</strong> Your project uses all-or-nothing funding. Supporters are only charged if you reach your goal — so set a realistic amount!
          </div>
        </div>
      )}

      {/* Step 3: Milestones */}
      {step === 3 && (
        <div className="space-y-5">
          <GuidedTip
            title="Why milestones keep your project on track"
            body="Milestones break your funding into spending steps. When your project is funded, you'll request money for each milestone and your teacher will approve it. This keeps things safe, organised, and teaches you real budget management!"
            learnMoreHref="/learn/managing-money/what-are-milestones"
            learnMoreLabel="Learn about milestones"
          />

          {milestones.map((milestone, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Milestone {index + 1}</span>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Input
                placeholder="e.g., Buy ingredients and packaging"
                value={milestone.title}
                onChange={(e) => updateMilestone(index, 'title', e.target.value)}
              />
              <Input
                placeholder="Brief description of what this money is for"
                value={milestone.description}
                onChange={(e) => updateMilestone(index, 'description', e.target.value)}
              />
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder={`Amount (${CURRENCY_SYMBOL})`}
                value={milestone.amount || ''}
                onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))}
              />
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
            <Plus className="h-4 w-4 mr-1" /> Add Milestone
          </Button>

          <div className={`text-sm font-medium p-3 rounded-xl ${Math.abs(milestoneTotal - goalNum) < 0.01 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            Milestone total: {CURRENCY_SYMBOL}{milestoneTotal.toFixed(2)} / Goal: {CURRENCY_SYMBOL}{goalNum.toFixed(2)}
            {Math.abs(milestoneTotal - goalNum) >= 0.01 && (
              <span className="block text-xs mt-1">Milestones must add up to your funding goal exactly.</span>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Mentor */}
      {step === 4 && (
        <div className="space-y-5">
          <GuidedTip
            title="Why your teacher is important"
            body="Your teacher is your project's trust anchor. They review your idea, approve it before it goes live, and help you manage your funding responsibly. Supporters feel more confident knowing a teacher is supporting you!"
          />

          {/* Show selected mentor if found via email */}
          {mentorId && mentorName && (
            <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800 flex items-center justify-between">
              <span>Selected mentor: <strong>{mentorName}</strong></span>
              <button
                type="button"
                onClick={() => { setMentorId(''); setMentorName(''); setMentorEmail(''); }}
                className="text-emerald-600 hover:underline text-xs"
              >
                Change
              </button>
            </div>
          )}

          {!mentorId && (
            <>
              {/* Option A: Select from dropdown */}
              {teachers.length > 0 && (
                <Select
                  label="Select a teacher from your school"
                  id="mentorId"
                  value={mentorId}
                  onChange={(e) => {
                    setMentorId(e.target.value);
                    const t = teachers.find(t => t.id === e.target.value);
                    if (t) setMentorName(t.full_name);
                  }}
                  placeholder="Choose a teacher"
                  options={teachers.map((t) => ({ value: t.id, label: t.full_name }))}
                />
              )}

              {teachers.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex-1 h-px bg-gray-200" />
                  or
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {/* Option B: Enter teacher email */}
              <div>
                <label htmlFor="mentorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Find a teacher by email
                </label>
                <div className="flex gap-2">
                  <input
                    id="mentorEmail"
                    type="email"
                    placeholder="teacher@school.sch.uk"
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={findTeacherByEmail}
                    isLoading={mentorSearching}
                    disabled={!mentorEmail.trim()}
                  >
                    Find
                  </Button>
                </div>
                {mentorSearchError && (
                  <p className="text-sm text-red-600 mt-2">{mentorSearchError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter your teacher&apos;s email address. They must already have a Futurepreneurs account.
                </p>
              </div>

              {/* Option C: Skip for now */}
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex-1 h-px bg-gray-200" />
                or
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
                <strong>Don&apos;t have a mentor yet?</strong> No worries — you can skip this step and add a teacher later from your project dashboard. Your project will be saved as a draft until a teacher is assigned and verifies it.
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Review Your Project</h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
            <div><span className="font-medium text-gray-500">Title:</span> <span className="text-gray-900">{title}</span></div>
            <div><span className="font-medium text-gray-500">Category:</span> <span className="text-gray-900">{category}</span></div>
            <div><span className="font-medium text-gray-500">Short Description:</span> <span className="text-gray-900">{shortDescription}</span></div>
            <div>
              <span className="font-medium text-gray-500">Type:</span>{' '}
              <span className="text-gray-900">
                {projectType === 'group' ? (
                  <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-blue-500" /> Group{groupName ? ` — ${groupName}` : ''}</span>
                ) : (
                  <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5 text-emerald-500" /> Solo</span>
                )}
              </span>
            </div>
            <div><span className="font-medium text-gray-500">Goal:</span> <span className="text-gray-900">{CURRENCY_SYMBOL}{goalNum.toFixed(2)}</span></div>
            <div><span className="font-medium text-gray-500">Milestones:</span> <span className="text-gray-900">{milestones.length}</span></div>
            {images.length > 0 && <div><span className="font-medium text-gray-500">Images:</span> <span className="text-gray-900">{images.length} uploaded</span></div>}
            {videoUrl && <div><span className="font-medium text-gray-500">Video:</span> <span className="text-gray-900">Yes</span></div>}
            <div><span className="font-medium text-gray-500">Mentor:</span> <span className={mentorId ? 'text-gray-900' : 'text-amber-600'}>{mentorId ? (mentorName || teachers.find(t => t.id === mentorId)?.full_name || 'Selected') : 'Not selected — you can add one later'}</span></div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800">
            This will save your project as a <strong>draft</strong>. You can review and edit it before submitting for teacher verification.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!canProceed()}
          >
            <Rocket className="h-4 w-4 mr-1" /> Create Project
          </Button>
        )}
      </div>
    </div>
  );
}
