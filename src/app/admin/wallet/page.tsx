import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { getAllCustodialAccounts } from '@/lib/queries/custodial-accounts';
import { getAllSpendingRequests } from '@/lib/queries/spending-requests';
import { createAdminClient } from '@/lib/supabase/server';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import {
  Wallet, Users, ShieldCheck, AlertTriangle, CreditCard, CheckCircle,
  XCircle, Clock,
} from 'lucide-react';

export default async function AdminWalletPage() {
  const user = await requireAdmin();

  const [accounts, requests] = await Promise.all([
    getAllCustodialAccounts(),
    getAllSpendingRequests(50),
  ]);

  const admin = createAdminClient();

  // Platform aggregate stats
  const { data: balances } = await admin
    .from('wallet_balances')
    .select('available_balance, held_balance, total_disbursed');

  const totalAvailable = (balances ?? []).reduce((s, b) => s + Number(b.available_balance), 0);
  const totalHeld = (balances ?? []).reduce((s, b) => s + Number(b.held_balance), 0);
  const totalDisbursed = (balances ?? []).reduce((s, b) => s + Number(b.total_disbursed), 0);

  const verifiedAccounts = accounts.filter(
    (a) => a.kyc_status === 'adult_verified' || a.kyc_status === 'fully_verified'
  );
  const pendingAccounts = accounts.filter((a) => a.kyc_status === 'pending');
  const failedAccounts = accounts.filter((a) => a.kyc_status === 'failed');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet Administration</h1>
        <p className="text-gray-600 mt-1">Platform-wide wallet overview, KYC status, and transaction monitoring.</p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200/60">
          <Wallet className="h-6 w-6 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{CURRENCY_SYMBOL}{totalAvailable.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total Available</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200/60">
          <Clock className="h-6 w-6 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{CURRENCY_SYMBOL}{totalHeld.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total Held</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200/60">
          <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{CURRENCY_SYMBOL}{totalDisbursed.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Total Disbursed</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200/60">
          <Users className="h-6 w-6 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
          <p className="text-sm text-gray-500">Custodial Accounts</p>
        </div>
      </div>

      {/* KYC Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">KYC Status Overview</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-semibold text-gray-900">{verifiedAccounts.length}</p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900">{pendingAccounts.length}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-semibold text-gray-900">{failedAccounts.length}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>
        </div>

        {/* Custodial Accounts Table */}
        {accounts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                  <th className="pb-3 pr-4">Parent</th>
                  <th className="pb-3 pr-4">Student</th>
                  <th className="pb-3 pr-4">KYC</th>
                  <th className="pb-3 pr-4">Stripe</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">{account.parent_name}</td>
                    <td className="py-3 pr-4 text-gray-700">{account.student_name}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        account.kyc_status === 'adult_verified' || account.kyc_status === 'fully_verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : account.kyc_status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {account.kyc_status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 font-mono text-xs">
                      {account.stripe_connected_account_id
                        ? account.stripe_connected_account_id.slice(0, 16) + '...'
                        : '—'}
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(account.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Spending Requests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Spending Requests</h2>
        {requests.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-600">No spending requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                  <th className="pb-3 pr-4">Student</th>
                  <th className="pb-3 pr-4">Project</th>
                  <th className="pb-3 pr-4">Vendor</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-gray-900">{req.student_name}</td>
                    <td className="py-3 pr-4 text-gray-700 truncate max-w-[150px]">{req.project_title}</td>
                    <td className="py-3 pr-4 text-gray-700">{req.vendor_name}</td>
                    <td className="py-3 pr-4 font-medium">{CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        req.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : req.status.startsWith('declined')
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(req.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
