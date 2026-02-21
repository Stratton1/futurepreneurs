'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { acceptInvitation, declineInvitation } from '@/app/dashboard/projects/[id]/team/actions';
import { Users, Check, X } from 'lucide-react';

interface Invitation {
  id: string;
  project_id: string;
  project_title: string;
}

export function PendingInvitations({ invitations: initial }: { invitations: Invitation[] }) {
  const [invitations, setInvitations] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  if (invitations.length === 0) return null;

  const handleAccept = async (id: string) => {
    setLoading(id);
    const result = await acceptInvitation(id);
    if (!result.error) {
      setInvitations((prev) => prev.filter((i) => i.id !== id));
    }
    setLoading(null);
  };

  const handleDecline = async (id: string) => {
    setLoading(id);
    const result = await declineInvitation(id);
    if (!result.error) {
      setInvitations((prev) => prev.filter((i) => i.id !== id));
    }
    setLoading(null);
  };

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold text-amber-900">Team Invitations</h3>
      </div>
      <div className="space-y-3">
        {invitations.map((inv) => (
          <div key={inv.id} className="bg-white rounded-lg p-3 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-700">
              You&apos;ve been invited to join <strong>{inv.project_title}</strong>
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                onClick={() => handleAccept(inv.id)}
                disabled={loading === inv.id}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDecline(inv.id)}
                disabled={loading === inv.id}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
