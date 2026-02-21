'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle, Crown, Clock, Trash2 } from 'lucide-react';
import { removeCollaborator } from '@/app/dashboard/projects/[id]/team/actions';

interface TeamMember {
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

interface TeamMemberListProps {
  members: TeamMember[];
  ownerName: string;
  projectId: string;
  canManage: boolean;
}

export function TeamMemberList({ members, ownerName, projectId, canManage }: TeamMemberListProps) {
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (memberId: string) => {
    setRemoving(memberId);
    await removeCollaborator(projectId, memberId);
    setRemoving(null);
  };

  return (
    <div className="space-y-2">
      {/* Owner */}
      <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-3">
        <UserCircle className="h-8 w-8 text-emerald-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm">{ownerName}</p>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <Crown className="h-3 w-3" /> Project Owner
          </p>
        </div>
      </div>

      {/* Collaborators */}
      {members.map((member) => (
        <div key={member.id} className={`flex items-center gap-3 rounded-lg p-3 ${member.accepted ? 'bg-gray-50' : 'bg-amber-50'}`}>
          <UserCircle className={`h-8 w-8 flex-shrink-0 ${member.accepted ? 'text-gray-400' : 'text-amber-400'}`} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm">
              {member.user?.display_handle || member.user?.full_name || 'Unknown'}
            </p>
            <p className={`text-xs flex items-center gap-1 ${member.accepted ? 'text-gray-500' : 'text-amber-600'}`}>
              {member.accepted ? (
                'Team Member'
              ) : (
                <>
                  <Clock className="h-3 w-3" /> Invitation pending
                </>
              )}
            </p>
          </div>
          {canManage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleRemove(member.id)}
              disabled={removing === member.id}
              className="text-red-500 flex-shrink-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}

      {members.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No team members yet. Invite students to collaborate!</p>
      )}
    </div>
  );
}
