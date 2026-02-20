'use client';

import { useRef, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CURRENCY_SYMBOL, MAX_FUNDING_GOAL } from '@/lib/constants';

const PRESET_AMOUNTS = [10, 25, 50, 100];

export interface BackProjectFormProps {
  projectId: string;
  projectTitle: string;
  goalAmount: number;
  totalRaised: number;
  currentUser?: { id: string; full_name: string; email: string };
}

export function BackProjectForm({
  projectId,
  projectTitle,
  goalAmount,
  totalRaised,
  currentUser,
}: BackProjectFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [backerName, setBackerName] = useState(currentUser?.full_name ?? '');
  const [backerEmail, setBackerEmail] = useState(currentUser?.email ?? '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = Math.max(0, goalAmount - totalRaised);
  const maxAmount = Math.min(remaining, MAX_FUNDING_GOAL);

  const effectiveAmount = typeof amount === 'number' ? amount : (customAmount ? parseFloat(customAmount) : 0);
  const isValidAmount = effectiveAmount >= 1 && effectiveAmount <= maxAmount;

  const openModal = () => {
    setError(null);
    setAmount('');
    setCustomAmount('');
    setBackerName(currentUser?.full_name ?? '');
    setBackerEmail(currentUser?.email ?? '');
    setIsAnonymous(false);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handlePresetClick = (value: number) => {
    setCustomAmount('');
    setAmount(value);
  };

  const handleCustomChange = (value: string) => {
    setAmount('');
    setCustomAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalAmount = typeof amount === 'number' ? amount : parseFloat(customAmount);
    if (isNaN(finalAmount) || finalAmount < 1 || finalAmount > maxAmount) {
      setError(`Please enter an amount between ${CURRENCY_SYMBOL}1 and ${CURRENCY_SYMBOL}${maxAmount.toFixed(2)}`);
      return;
    }

    const name = backerName.trim();
    const email = backerEmail.trim();
    if (!name || !email) {
      setError('Please enter your name and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          amount: finalAmount,
          backerName: name,
          backerEmail: email,
          isAnonymous,
          backerId: currentUser?.id ?? undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
        return;
      }

      setError('Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full flex items-center justify-center gap-2"
        onClick={openModal}
      >
        <Heart className="h-5 w-5" />
        Back This Project
      </Button>

      <dialog
        ref={dialogRef}
        onCancel={closeModal}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/30 backdrop:backdrop-blur-sm [&::backdrop]:bg-black/30"
        aria-labelledby="back-dialog-title"
        aria-describedby="back-dialog-desc"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 id="back-dialog-title" className="text-xl font-bold text-gray-900">
                Back this project
              </h2>
              <p id="back-dialog-desc" className="text-sm text-gray-500 mt-1">
                {projectTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {CURRENCY_SYMBOL}{remaining.toFixed(2)} still needed to reach the goal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PRESET_AMOUNTS.filter((a) => a <= maxAmount).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handlePresetClick(value)}
                    className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                      amount === value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {CURRENCY_SYMBOL}{value}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Other:</span>
                <input
                  type="number"
                  min={1}
                  max={maxAmount}
                  step={0.01}
                  placeholder={`${CURRENCY_SYMBOL}1 - ${CURRENCY_SYMBOL}${maxAmount}`}
                  value={customAmount}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className="w-32 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <Input
              label="Your name"
              type="text"
              id="backer-name"
              value={backerName}
              onChange={(e) => setBackerName(e.target.value)}
              required
              placeholder="Full name"
            />
            <Input
              label="Email"
              type="email"
              id="backer-email"
              value={backerEmail}
              onChange={(e) => setBackerEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Back as anonymous</span>
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}

            <p className="text-xs text-gray-500">
              A 2.5% platform fee applies when the project is fully funded.
            </p>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={!isValidAmount || isSubmitting}
                className="flex-1"
              >
                Continue to payment
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
