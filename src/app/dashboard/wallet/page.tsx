import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getCustodialAccountForStudent } from '@/lib/queries/custodial-accounts';
import { getWalletBalancesForAccount } from '@/lib/queries/wallet-balances';
import { getSpendingRequestsForStudent } from '@/lib/queries/spending-requests';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import {
  Wallet, CreditCard, Clock, CheckCircle, XCircle, ArrowRight,
  ShoppingCart, AlertCircle, Receipt,
} from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending_parent: { label: 'Awaiting parent', color: 'text-amber-600 bg-amber-50', icon: Clock },
  pending_mentor: { label: 'Awaiting mentor', color: 'text-blue-600 bg-blue-50', icon: Clock },
  approved: { label: 'Approved (cooling off)', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  funded: { label: 'Card active', color: 'text-green-600 bg-green-50', icon: CreditCard },
  completed: { label: 'Completed', color: 'text-gray-600 bg-gray-50', icon: CheckCircle },
  declined_parent: { label: 'Declined by parent', color: 'text-red-600 bg-red-50', icon: XCircle },
  declined_mentor: { label: 'Declined by mentor', color: 'text-red-600 bg-red-50', icon: XCircle },
  expired: { label: 'Expired', color: 'text-gray-400 bg-gray-50', icon: Clock },
  reversed: { label: 'Reversed', color: 'text-orange-600 bg-orange-50', icon: XCircle },
};

export default async function StudentWalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/dashboard');

  const custodialAccount = await getCustodialAccountForStudent(user.id);

  // No wallet set up yet
  if (!custodialAccount) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-1">Your digital wallet for managing project funds.</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 text-center border border-purple-100">
          <Wallet className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet not set up yet</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Ask your parent to set up your digital wallet. Once set up, you&apos;ll be able to
            view your project balances and request purchases here.
          </p>
        </div>
      </div>
    );
  }

  const [balances, requests] = await Promise.all([
    getWalletBalancesForAccount(custodialAccount.id),
    getSpendingRequestsForStudent(user.id),
  ]);

  const totalAvailable = balances.reduce((sum, b) => sum + Number(b.available_balance), 0);
  const totalHeld = balances.reduce((sum, b) => sum + Number(b.held_balance), 0);
  const pendingRequests = requests.filter(
    (r) => r.status === 'pending_parent' || r.status === 'pending_mentor' || r.status === 'approved'
  );
  const recentRequests = requests.slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-1">View balances and request purchases.</p>
        </div>
        <Link
          href="/dashboard/wallet/request"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          Request Purchase
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-5 border border-emerald-200/60">
          <Wallet className="h-6 w-6 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{CURRENCY_SYMBOL}{totalAvailable.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-0.5">Available</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-amber-200/60">
          <Clock className="h-6 w-6 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{CURRENCY_SYMBOL}{totalHeld.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-0.5">Held for purchases</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200/60">
          <ShoppingCart className="h-6 w-6 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Pending requests</p>
        </div>
      </div>

      {/* KYC Status Banner */}
      {custodialAccount.kyc_status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Wallet setup in progress</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your parent is still completing the wallet verification. You&apos;ll be notified when it&apos;s ready.
            </p>
          </div>
        </div>
      )}

      {/* Per-Project Balances */}
      {balances.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Project Balances</h2>
          <div className="space-y-3">
            {balances.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Project #{b.project_id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Available: {CURRENCY_SYMBOL}{Number(b.available_balance).toFixed(2)}
                    {Number(b.held_balance) > 0 && (
                      <span className="text-amber-600 ml-2">
                        (Held: {CURRENCY_SYMBOL}{Number(b.held_balance).toFixed(2)})
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Total disbursed: {CURRENCY_SYMBOL}{Number(b.total_disbursed).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Spending Requests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Spending Requests</h2>
        {recentRequests.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <Receipt className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No spending requests yet.</p>
            <p className="text-sm text-gray-500 mt-1">
              When you need to make a purchase for your project, request it here!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((req) => {
              const statusInfo = STATUS_LABELS[req.status] ?? STATUS_LABELS.expired;
              const StatusIcon = statusInfo.icon;
              const needsReceipt = req.status === 'completed' && !req.receipt_url;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{req.vendor_name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{req.reason}</p>
                      {req.project_title && (
                        <p className="text-xs text-gray-400 mt-1">Project: {req.project_title}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(req.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900">
                        {CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}
                      </p>
                      {needsReceipt && (
                        <span className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                          <Receipt className="h-3 w-3" />
                          Receipt needed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
