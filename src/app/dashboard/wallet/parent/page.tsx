import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getCustodialAccountsForParent } from '@/lib/queries/custodial-accounts';
import { getWalletBalancesForAccount } from '@/lib/queries/wallet-balances';
import { getPendingRequestsForParent, getAllRequestsForParent } from '@/lib/queries/spending-requests';
import { createAdminClient } from '@/lib/supabase/server';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import {
  Wallet, ShieldCheck, Clock, CreditCard, Users, AlertTriangle,
  CheckCircle, XCircle, ArrowRight,
} from 'lucide-react';
import { ParentApprovalActions } from './parent-approval-actions';

export default async function ParentWalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'parent') redirect('/dashboard');

  const accounts = await getCustodialAccountsForParent(user.id);

  // Check if parent has linked children
  const admin = createAdminClient();
  const { data: children } = await admin
    .from('user_profiles')
    .select('id, full_name')
    .eq('parent_id', user.id)
    .eq('role', 'student');

  const linkedChildren = children ?? [];

  if (accounts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
          <p className="text-gray-600 mt-1">Set up and manage digital wallets for your children.</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-10 text-center border border-purple-100">
          <ShieldCheck className="h-14 w-14 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Set up a Digital Wallet</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Create a secure digital wallet for your child to manage their project funds.
            You&apos;ll need to complete identity verification.
          </p>
          {linkedChildren.length > 0 ? (
            <Link
              href="/dashboard/wallet/onboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Start Setup
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <p className="text-sm text-gray-500">
              You need to link a child to your account first. Go to your{' '}
              <Link href="/dashboard/profile" className="text-emerald-600 hover:underline">profile</Link>
              {' '}to connect.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Fetch data for each account
  const accountData = await Promise.all(
    accounts.map(async (account) => {
      const balances = await getWalletBalancesForAccount(account.id);
      const studentName = linkedChildren.find((c) => c.id === account.student_id)?.full_name ?? 'Student';
      const totalAvailable = balances.reduce((sum, b) => sum + Number(b.available_balance), 0);
      const totalHeld = balances.reduce((sum, b) => sum + Number(b.held_balance), 0);
      return { account, balances, studentName, totalAvailable, totalHeld };
    })
  );

  const pendingRequests = await getPendingRequestsForParent(user.id);
  const allRequests = await getAllRequestsForParent(user.id);
  const recentCompleted = allRequests
    .filter((r) => r.status === 'completed' || r.status === 'declined_parent' || r.status === 'declined_mentor')
    .slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
          <p className="text-gray-600 mt-1">Manage wallets, approve purchases, and monitor spending.</p>
        </div>
        <Link
          href="/dashboard/wallet/onboard"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Users className="h-4 w-4" />
          Add Wallet
        </Link>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {accountData.map(({ account, studentName, totalAvailable, totalHeld }) => (
          <div
            key={account.id}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{studentName}</h3>
                <span className={`text-xs font-medium ${
                  account.kyc_status === 'adult_verified' || account.kyc_status === 'fully_verified'
                    ? 'text-emerald-600'
                    : account.kyc_status === 'failed'
                      ? 'text-red-600'
                      : 'text-amber-600'
                }`}>
                  {account.kyc_status === 'adult_verified' || account.kyc_status === 'fully_verified'
                    ? 'Verified'
                    : account.kyc_status === 'failed'
                      ? 'Verification failed'
                      : 'Verification pending'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-lg font-bold text-gray-900">{CURRENCY_SYMBOL}{totalAvailable.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-lg font-bold text-gray-900">{CURRENCY_SYMBOL}{totalHeld.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Held</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Queue */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          Pending Your Approval
          {pendingRequests.length > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No pending approvals.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-amber-200 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {req.student_name} wants to spend {CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Vendor:</span> {req.vendor_name}
                      {req.vendor_url && (
                        <span className="text-gray-400"> ({req.vendor_url})</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      <span className="font-medium">Reason:</span> {req.reason}
                    </p>
                    {req.project_title && (
                      <p className="text-xs text-gray-400 mt-1">Project: {req.project_title}</p>
                    )}
                    {req.milestone_title && (
                      <p className="text-xs text-gray-400">Milestone: {req.milestone_title}</p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-gray-900 flex-shrink-0">
                    {CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}
                  </p>
                </div>
                <ParentApprovalActions requestId={req.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentCompleted.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {recentCompleted.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {req.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{req.vendor_name}</p>
                    <p className="text-xs text-gray-500">{req.student_name} &middot; {req.project_title}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">{CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(req.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
