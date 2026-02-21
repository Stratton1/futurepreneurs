'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { inviteCollaborator } from '@/app/dashboard/projects/[id]/team/actions';

interface InviteCollaboratorFormProps {
  projectId: string;
}

export function InviteCollaboratorForm({ projectId }: InviteCollaboratorFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await inviteCollaborator(projectId, email.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Invitation sent!');
      setEmail('');
      setTimeout(() => setSuccess(''), 3000);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleInvite} className="space-y-3">
      <label htmlFor="collabEmail" className="block text-sm font-medium text-gray-700">
        Invite a student by email
      </label>
      <div className="flex gap-2">
        <input
          id="collabEmail"
          type="email"
          placeholder="student@school.sch.uk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <Button type="submit" variant="outline" isLoading={loading} disabled={!email.trim()}>
          <UserPlus className="h-4 w-4 mr-1" /> Invite
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}
      <p className="text-xs text-gray-500">
        Only students from the same school can be invited.
      </p>
    </form>
  );
}
