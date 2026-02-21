'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { linkParent, linkChild, unlinkParent } from './actions';
import { UserPlus, X, GraduationCap, Heart } from 'lucide-react';

interface Props {
  role: string;
  parentInfo: { id: string; full_name: string; email: string } | null;
  linkedChildren: { id: string; full_name: string; email: string }[];
  mentoredProjects: { id: string; title: string; student_name: string }[];
}

export function RelationshipSection({ role, parentInfo, linkedChildren, mentoredProjects }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLinkParent = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await linkParent(email);
    if (result.error) setError(result.error);
    else setSuccess(`Linked to ${result.parentName}!`);
    setEmail('');
    setLoading(false);
  };

  const handleLinkChild = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await linkChild(email);
    if (result.error) setError(result.error);
    else setSuccess(`Linked to ${result.childName}!`);
    setEmail('');
    setLoading(false);
  };

  const handleUnlinkParent = async () => {
    if (!confirm('Remove the link to your parent/guardian?')) return;
    setLoading(true);
    const result = await unlinkParent();
    if (result.error) setError(result.error);
    else setSuccess('Parent unlinked.');
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Student: show linked parent or link form */}
      {role === 'student' && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Parent / Guardian</h3>
          {parentInfo ? (
            <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-gray-900">{parentInfo.full_name}</p>
                  <p className="text-xs text-gray-500">{parentInfo.email}</p>
                </div>
              </div>
              <button
                onClick={handleUnlinkParent}
                disabled={loading}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Remove link"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Link your parent or guardian so they can give consent on your projects.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleLinkParent} isLoading={loading} disabled={!email.trim()}>
                  <UserPlus className="h-4 w-4 mr-1" /> Link
                </Button>
              </div>
              <p className="text-xs text-gray-400">They must have signed up as a parent on Futurepreneurs.</p>
            </div>
          )}
        </div>
      )}

      {/* Parent: show linked children or link form */}
      {role === 'parent' && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">My Children</h3>
          {linkedChildren.length > 0 ? (
            <div className="space-y-2 mb-4">
              {linkedChildren.map((child) => (
                <div key={child.id} className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="font-medium text-gray-900">{child.full_name}</p>
                    <p className="text-xs text-gray-500">{child.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-3">No children linked yet.</p>
          )}
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Link your child by entering their school email.</p>
            <div className="flex gap-2">
              <Input
                placeholder="child@school.sch.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleLinkChild} isLoading={loading} disabled={!email.trim()}>
                <UserPlus className="h-4 w-4 mr-1" /> Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher: show mentored students */}
      {role === 'teacher' && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Students I Mentor</h3>
          {mentoredProjects.length > 0 ? (
            <div className="space-y-2">
              {mentoredProjects.map((p) => (
                <div key={p.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.student_name}</p>
                    <p className="text-xs text-gray-500">Project: {p.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No students have selected you as a mentor yet.</p>
          )}
        </div>
      )}

      {/* Investor: nothing to show */}
      {role === 'investor' && (
        <p className="text-sm text-gray-500">As a backer, you&apos;ll see your backed projects on your dashboard.</p>
      )}

      {role === 'admin' && (
        <p className="text-sm text-gray-500">Admin accounts don&apos;t have relationship links.</p>
      )}
    </div>
  );
}
