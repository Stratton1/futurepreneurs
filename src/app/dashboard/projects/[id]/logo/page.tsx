'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { LogoBuilder } from '@/components/features/logo-builder';
import { LogoPreview } from '@/components/features/logo-preview';
import { saveLogo, removeLogo } from './actions';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { LogoConfig } from '@/lib/logo-templates';

interface ProjectLogoData {
  id: string;
  title: string;
  status: string;
  logo_config: LogoConfig | null;
  logo_approved: boolean;
}

export default function LogoBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectLogoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        setError('Project not found');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProject({
        id: data.id,
        title: data.title,
        status: data.status,
        logo_config: data.logo_config ?? null,
        logo_approved: data.logo_approved ?? false,
      });
    } catch {
      setError('Failed to load project');
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    const t = setTimeout(() => { loadProject(); }, 0);
    return () => clearTimeout(t);
  }, [loadProject]);

  const handleSave = async (config: LogoConfig) => {
    setError(null);
    setSuccess(null);
    const result = await saveLogo(projectId, config);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Logo saved!');
      setProject((prev) => prev ? { ...prev, logo_config: config, logo_approved: false } : prev);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleRemove = async () => {
    setError(null);
    setSuccess(null);
    const result = await removeLogo(projectId);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Logo removed.');
      setProject((prev) => prev ? { ...prev, logo_config: null, logo_approved: false } : prev);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  const isDraft = project.status === 'draft';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logo Builder</h1>
          <p className="text-gray-600 mt-1">Create a logo for &ldquo;{project.title}&rdquo;</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Edit
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {success && <Alert type="success" message={success} className="mb-6" />}

      {!isDraft && (
        <Alert type="info" message="Logos can only be edited while the project is in draft status." className="mb-6" />
      )}

      {project.logo_config && project.logo_approved && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-6 flex items-center gap-3 text-sm text-emerald-800">
          <LogoPreview config={project.logo_config} size={48} />
          <span>Your logo has been <strong>approved</strong> by your teacher.</span>
        </div>
      )}

      {project.logo_config && !project.logo_approved && (
        <div className="bg-amber-50 rounded-xl p-4 mb-6 text-sm text-amber-800">
          Your logo is saved but <strong>not yet approved</strong>. Your teacher will review it when they verify your project.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <LogoBuilder
          initialConfig={project.logo_config}
          onSave={handleSave}
          disabled={!isDraft}
        />
      </div>

      {project.logo_config && isDraft && (
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={handleRemove} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-1" /> Remove Logo
          </Button>
        </div>
      )}
    </div>
  );
}
