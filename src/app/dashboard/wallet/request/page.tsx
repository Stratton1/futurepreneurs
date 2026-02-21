'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSpendingRequest } from '../spending-actions';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SpendingRequestPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [milestoneId, setMilestoneId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorUrl, setVendorUrl] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Projects would be loaded from the API in a real implementation
  // For now, the student enters the project ID directly or selects from a list

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!projectId.trim()) { setError('Please select a project'); return; }
    if (!vendorName.trim()) { setError('Vendor name is required'); return; }
    if (!amount || Number(amount) <= 0) { setError('Please enter a valid amount'); return; }
    if (!reason.trim()) { setError('Please explain what this purchase is for'); return; }

    setIsSubmitting(true);
    const result = await createSpendingRequest({
      projectId: projectId.trim(),
      milestoneId: milestoneId.trim() || undefined,
      vendorName: vendorName.trim(),
      vendorUrl: vendorUrl.trim() || undefined,
      amount: Number(amount),
      reason: reason.trim(),
    });
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-emerald-50 rounded-2xl p-10 text-center border border-emerald-200">
          <ShoppingCart className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your parent will be notified and can approve or decline your request.
            After parent approval, your mentor will also need to approve it.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Back to Wallet
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setVendorName('');
                setVendorUrl('');
                setAmount('');
                setReason('');
                setMilestoneId('');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold px-5 py-2.5"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/wallet"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Wallet
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request a Purchase</h1>
        <p className="text-gray-600 mt-1">
          Tell us what you need to buy. Your parent and mentor will both need to approve before the purchase can be made.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Select the project this purchase is for"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Milestone (optional)
          </label>
          <input
            type="text"
            value={milestoneId}
            onChange={(e) => setMilestoneId(e.target.value)}
            placeholder="Which milestone is this purchase for?"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Where do you want to buy from? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g. Amazon, Hobbycraft, local supplier"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link to item (optional)
          </label>
          <input
            type="url"
            value={vendorUrl}
            onChange={(e) => setVendorUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How much? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">£</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What is this for? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what you're buying and why you need it for your project"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-1">How it works</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>You submit this request</li>
            <li>Your parent reviews and approves (or declines)</li>
            <li>Your mentor then reviews and approves (or declines)</li>
            <li>After a 1-hour cooling-off period, your card is activated for 30 minutes</li>
            <li>Make your purchase, then upload the receipt</li>
          </ol>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
}
