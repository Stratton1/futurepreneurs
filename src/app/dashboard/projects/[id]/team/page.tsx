'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { TeamMemberList } from '@/components/features/team-member-list';
import { InviteCollaboratorForm } from '@/components/features/invite-collaborator-form';
import { ArrowLeft, Users } from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  status: string;
  project_type: string;
  student_id: string;
}

interface CollaboratorData {
  id: string;
  user_id: string;
  role: string;
  accepted: boolean;
  user?: {
    id: string;
    full_name: string;
    display_handle: string | null;
  };
}

export default function TeamManagementPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<CollaboratorData[]>([]);
  const [currentUserName, setCurrentUserName] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [projRes, teamRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/team`),
      ]);

      if (projRes.ok) {
        const data = await projRes.json();
        setProject(data);
      } else {
        setError('Project not found');
      }

      if (teamRes.ok) {
        const data = await teamRes.json();
        setMembers(data.members || []);
        setCurrentUserName(data.ownerName || '');
      }
    } catch {
      setError('Failed to load team data');
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    const t = setTimeout(() => { loadData(); }, 0);
    return () => clearTimeout(t);
  }, [loadData]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  if (project.project_type !== 'group') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Not a Group Project</h2>
        <p className="text-gray-600 mb-4">Team management is only available for group projects.</p>
        <Button variant="outline" onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Edit
        </Button>
      </div>
    );
  }

  const isDraft = project.status === 'draft';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" /> Team
          </h1>
          <p className="text-gray-600 mt-1">Manage your project team for &ldquo;{project.title}&rdquo;</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/projects/${projectId}/edit`)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Team Members</h2>
          <TeamMemberList
            members={members}
            ownerName={currentUserName}
            projectId={projectId}
            canManage={isDraft}
          />
        </section>

        {isDraft && (
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Invite Team Members</h2>
            <InviteCollaboratorForm projectId={projectId} />
          </section>
        )}
      </div>
    </div>
  );
}
