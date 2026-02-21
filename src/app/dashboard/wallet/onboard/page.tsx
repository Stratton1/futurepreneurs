'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { initiateOnboarding, checkOnboardingStatus, refreshOnboardingLink } from '../actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ShieldCheck, ArrowRight, CheckCircle, AlertCircle, Loader2,
  CreditCard, Users, ArrowLeft,
} from 'lucide-react';

type Step = 'select-child' | 'verifying' | 'complete' | 'failed';

export default function WalletOnboardingPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('select-child');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if returning from Stripe onboarding
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const storedAccountId = searchParams.get('accountId');
    if (stepParam === 'complete' && storedAccountId) {
      setAccountId(storedAccountId);
      setStep('verifying');
      checkStatus(storedAccountId);
    }
  }, [searchParams]);

  async function checkStatus(accId: string) {
    const result = await checkOnboardingStatus(accId);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.status === 'complete') {
      setStep('complete');
    } else if (result.kycStatus === 'failed') {
      setStep('failed');
    }
  }

  async function handleStart() {
    if (!studentId.trim()) {
      setError('Please enter your child\'s student ID');
      return;
    }
    setError(null);
    setIsLoading(true);

    const result = await initiateOnboarding(studentId.trim());
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.onboardingUrl) {
      if (result.accountId) setAccountId(result.accountId);
      window.location.href = result.onboardingUrl;
    }
  }

  async function handleRefreshLink() {
    if (!accountId) return;
    setIsLoading(true);
    setError(null);
    const result = await refreshOnboardingLink(accountId);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.onboardingUrl) {
      window.location.href = result.onboardingUrl;
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/wallet/parent"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Wallet
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set Up Digital Wallet</h1>
        <p className="text-gray-600 mt-1">
          Create a secure digital wallet for your child&apos;s project funds.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { label: 'Select Child', key: 'select-child' },
          { label: 'Verify Identity', key: 'verifying' },
          { label: 'Complete', key: 'complete' },
        ].map((s, i) => {
          const isActive =
            s.key === step ||
            (s.key === 'select-child' && step === 'select-child') ||
            (s.key === 'verifying' && (step === 'verifying' || step === 'complete'));
          const isComplete =
            (s.key === 'select-child' && step !== 'select-child') ||
            (s.key === 'verifying' && step === 'complete');
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isComplete
                    ? 'bg-emerald-100 text-emerald-700'
                    : isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isComplete ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: Select Child */}
      {step === 'select-child' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Link Your Child</h2>
              <p className="text-sm text-gray-600">
                Enter your child&apos;s student account ID to set up their wallet.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Your child's account ID"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your child must already be linked to your account. You can find their ID in your profile.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-1">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>You&apos;ll be redirected to complete identity verification</li>
              <li>Once verified, your child will get a digital wallet</li>
              <li>All purchases require your approval before they go through</li>
              <li>You&apos;ll have full control over spending limits</li>
            </ul>
          </div>

          <Button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue to Verification
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Step 2: Verifying */}
      {step === 'verifying' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Loader2 className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Checking Verification Status</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re checking if your identity verification is complete.
          </p>
          <Button
            onClick={handleRefreshLink}
            disabled={isLoading}
            variant="outline"
            className="mx-auto"
          >
            {isLoading ? 'Loading...' : 'Continue Verification'}
          </Button>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === 'complete' && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 text-center">
          <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet Set Up!</h2>
          <p className="text-gray-600 mb-6">
            Your child&apos;s digital wallet is now ready. They can view their wallet and request purchases
            once funds are deposited from funded projects.
          </p>
          <Link
            href="/dashboard/wallet/parent"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Go to Wallet Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Failed */}
      {step === 'failed' && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center">
          <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Issue</h2>
          <p className="text-gray-600 mb-6">
            There was a problem with the identity verification. Please try again or contact support.
          </p>
          <Button
            onClick={handleRefreshLink}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl"
          >
            {isLoading ? 'Loading...' : 'Try Again'}
          </Button>
        </div>
      )}
    </div>
  );
}
