'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { signUp } from '../actions';
import type { UserRole } from '@/types/database';

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'student',
    label: 'Student',
    description: "I'm under 18 and want to start a business",
  },
  {
    value: 'teacher',
    label: 'Teacher / Mentor',
    description: 'I work at a school and want to support students',
  },
  {
    value: 'parent',
    label: 'Parent / Guardian',
    description: "I want to support my child's project",
  },
  {
    value: 'investor',
    label: 'Backer / Supporter',
    description: 'I want to fund young entrepreneurs',
  },
];

export default function SignUpPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await signUp({ email, password, fullName, role });

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.message || 'Account created! Check your email.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-emerald-500 rounded-xl p-2">
              <Rocket className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Futurepreneurs</h1>
          <p className="text-gray-600">Create your account and get started</p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <Alert type="success" message={success} className="mb-4" />
            <p className="text-gray-600 text-sm">
              Once you&apos;ve verified your email, you can{' '}
              <Link href="/login" className="text-emerald-600 font-medium hover:underline">
                log in here
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Step 1: Choose role */}
            {!role ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">I am a...</h2>
                <div className="space-y-3">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                    >
                      <span className="font-semibold text-gray-900">{option.label}</span>
                      <span className="block text-sm text-gray-500 mt-0.5">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 2: Fill in details */
              <form onSubmit={handleSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="text-sm text-emerald-600 hover:underline mb-2"
                >
                  &larr; Change role
                </button>

                <div className="bg-emerald-50 rounded-xl px-4 py-2.5 text-sm">
                  Signing up as: <strong>{ROLE_OPTIONS.find((r) => r.value === role)?.label}</strong>
                </div>

                {error && <Alert type="error" message={error} />}

                <Input
                  id="fullName"
                  label="Full name"
                  placeholder="Your first and last name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder={role === 'student' ? 'your.name@school.sch.uk' : 'you@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  hint={role === 'student' ? 'You must use your school email address' : undefined}
                  required
                />

                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hint="Must include uppercase, lowercase, and a number"
                  required
                />

                <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
                  Create Account
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 font-medium hover:underline">
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
