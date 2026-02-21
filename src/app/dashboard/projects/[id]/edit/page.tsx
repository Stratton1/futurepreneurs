'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { PROJECT_CATEGORIES, CURRENCY_SYMBOL, MAX_FUNDING_GOAL } from '@/lib/constants';
import { updateProject, submitForVerification } from '../../actions';
import { ArrowLeft, Save, Send, Plus, Trash2, UserPlus, Gift, Paintbrush, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

interface Milestone {
  id?: string;
  title: string;
  description: string;
  amount: number;
}

interface ProjectData {
  id: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  goal_amount: number;
  video_url: string | null;
  images: string[];
  status: string;
  mentor_id: string | null;
  milestones: Milestone[];
  mentor: { id: string; full_name: string } | null;
  project_type: string;
  group_name: string | null;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [mentorId, setMentorId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [status, setStatus] = useState('');
  const [projectType, setProjectType] = useState('');

  // Mentor search
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorSearchError, setMentorSearchError] = useState('');
  const [mentorSearching, setMentorSearching] = useState(false);

  // Teachers dropdown
  const [teachers, setTeachers] = useState<{ id: string; full_name: string }[]>([]);

  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        setError('Project not found');
        setLoading(false);
        return;
      }
      const data: ProjectData = await res.json();
      setTitle(data.title);
      setCategory(data.category);
      setShortDescription(data.short_description || '');
      setDescription(data.description || '');
      setVideoUrl(data.video_url || '');
      setGoalAmount(String(data.goal_amount));
      setMilestones(data.milestones.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        amount: m.amount,
      })));
      setMentorId(data.mentor_id || '');
      setMentorName(data.mentor?.full_name || '');
      setStatus(data.status);
      setProjectType(data.project_type || 'individual');
    } catch {
      setError('Failed to load project');
    }
    setLoading(false);
  }, [projectId]);

  const loadTeachers = useCallback(async () => {
    try {
      const res = await fetch('/api/teachers');
      if (res.ok) {
        const data = await res.json();
        setTeachers(data.teachers || []);
      }
    } catch {
      // Teachers will be empty
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadProject();
      loadTeachers();
    }, 0);
    return () => clearTimeout(t);
  }, [loadProject, loadTeachers]);

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
        setMentorEmail('');
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

  const updateMilestone = (index: number, field: keyof Milestone, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const goalNum = Number(goalAmount) || 0;
  const milestoneTotal = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const result = await updateProject(projectId, {
      title,
      shortDescription,
      description,
      category,
      goalAmount: goalNum,
      videoUrl: videoUrl || undefined,
      images: [],
      milestones: milestones.map(m => ({
        title: m.title,
        description: m.description,
        amount: Number(m.amount),
      })),
      mentorId: mentorId || undefined,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Project saved!');
      setTimeout(() => setSuccess(null), 3000);
    }
    setSaving(false);
  };

  const handleSubmitForVerification = async () => {
    if (!mentorId) {
      setError('You need to select a mentor before submitting for verification.');
      return;
    }

    // Save first
    await handleSave();

    if (!confirm('Submit this project for teacher verification? Your teacher will review it before it goes live.')) return;

    setSubmitting(true);
    setError(null);

    const result = await submitForVerification(projectId);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setSuccess('Project submitted for verification!');
    setTimeout(() => router.push('/dashboard/projects'), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (status !== 'draft') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cannot Edit</h2>
        <p className="text-gray-600 mb-4">This project can only be edited while it&apos;s in draft status.</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">Update your project details before submitting for review.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/projects')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}

      <div className="space-y-8">
        {/* Basics */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Basics</h2>
          <Input
            label="Project Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Sarah's Homemade Candles"
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
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Describe your project in a sentence or two..."
            rows={2}
          />
        </section>

        {/* Details */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Full Description</h2>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell people all about your project..."
            hint="Minimum 50 characters"
            rows={6}
          />
          <Link
            href={`/dashboard/projects/${projectId}/pitch-builder`}
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Sparkles className="h-4 w-4" /> Need help? Use the Pitch Builder →
          </Link>
          <Input
            label="Video URL (optional)"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </section>

        {/* Funding */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Funding Goal</h2>
          <Input
            label={`Amount (${CURRENCY_SYMBOL})`}
            id="goalAmount"
            type="number"
            min="1"
            max={MAX_FUNDING_GOAL}
            step="0.01"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            hint={`Maximum ${CURRENCY_SYMBOL}${MAX_FUNDING_GOAL.toLocaleString()}`}
          />
        </section>

        {/* Milestones */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Milestones</h2>

          {milestones.map((milestone, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Milestone {index + 1}</span>
                {milestones.length > 1 && (
                  <button type="button" onClick={() => removeMilestone(index)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Input placeholder="Title" value={milestone.title} onChange={(e) => updateMilestone(index, 'title', e.target.value)} />
              <Input placeholder="Description" value={milestone.description} onChange={(e) => updateMilestone(index, 'description', e.target.value)} />
              <Input type="number" min="0.01" step="0.01" placeholder={`Amount (${CURRENCY_SYMBOL})`} value={milestone.amount || ''} onChange={(e) => updateMilestone(index, 'amount', Number(e.target.value))} />
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
        </section>

        {/* Mentor */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-emerald-500" /> Mentor / Teacher
          </h2>

          {mentorId && mentorName ? (
            <div className="bg-emerald-50 rounded-xl p-4 text-sm text-emerald-800 flex items-center justify-between">
              <span>Selected mentor: <strong>{mentorName}</strong></span>
              <button
                type="button"
                onClick={() => { setMentorId(''); setMentorName(''); }}
                className="text-emerald-600 hover:underline text-xs"
              >
                Change
              </button>
            </div>
          ) : (
            <>
              {teachers.length > 0 && (
                <Select
                  label="Select a teacher from your school"
                  id="mentorSelect"
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
                  <Button type="button" variant="outline" onClick={findTeacherByEmail} isLoading={mentorSearching} disabled={!mentorEmail.trim()}>
                    Find
                  </Button>
                </div>
                {mentorSearchError && <p className="text-sm text-red-600 mt-2">{mentorSearchError}</p>}
              </div>

              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
                <strong>A mentor is required</strong> before you can submit your project for verification. Your teacher will review and approve your project.
              </div>
            </>
          )}
        </section>
        {/* Logo Builder */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-blue-500" /> Business Logo
          </h2>
          <p className="text-sm text-gray-600">
            Create a fun logo for your business using our template builder.
          </p>
          <Link
            href={`/dashboard/projects/${projectId}/logo`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Paintbrush className="h-4 w-4" /> Open Logo Builder →
          </Link>
        </section>

        {/* Team (group projects only) */}
        {projectType === 'group' && (
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" /> Team Members
            </h2>
            <p className="text-sm text-gray-600">
              Invite students from your school to collaborate on this project.
            </p>
            <Link
              href={`/dashboard/projects/${projectId}/team`}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Users className="h-4 w-4" /> Manage Team →
            </Link>
          </section>
        )}

        {/* Reward Tiers */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" /> Reward Tiers
          </h2>
          <p className="text-sm text-gray-600">
            Offer backers something in return — like a thank-you card, early access, or a custom item.
          </p>
          <Link
            href={`/dashboard/projects/${projectId}/rewards`}
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            <Gift className="h-4 w-4" /> Manage Reward Tiers →
          </Link>
        </section>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={handleSave} isLoading={saving} disabled={submitting}>
          <Save className="h-4 w-4 mr-1" /> Save Draft
        </Button>

        <Button onClick={handleSubmitForVerification} isLoading={submitting} disabled={saving || !mentorId}>
          <Send className="h-4 w-4 mr-1" /> Submit for Verification
        </Button>
      </div>
    </div>
  );
}
