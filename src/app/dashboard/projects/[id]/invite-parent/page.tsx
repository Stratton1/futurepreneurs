'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { linkParentToProject } from '../../actions';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function InviteParentPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await linkParentToProject(projectId, email);

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
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Alert type="success" message="Parent linked successfully! They'll be notified to give consent." />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Projects
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Your Parent/Guardian</h1>
      <p className="text-gray-600 mb-6">
        Your project needs parent/guardian consent before it can go live. Enter their email address below — they&apos;ll need a Futurepreneurs account as a parent.
      </p>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Parent/Guardian Email"
          id="parentEmail"
          type="email"
          placeholder="parent@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hint="They must have signed up as a parent on Futurepreneurs"
          required
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          <UserPlus className="h-4 w-4 mr-1" /> Link Parent
        </Button>
      </form>
    </div>
  );
}
