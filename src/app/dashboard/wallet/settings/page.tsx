import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getCustodialAccountForStudent } from '@/lib/queries/custodial-accounts';
import { getIssuedCardsForAccount } from '@/lib/queries/wallet-balances';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import {
  Settings, CreditCard, Shield, Clock, ArrowLeft, AlertCircle, Info,
} from 'lucide-react';

export default async function WalletSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'student') redirect('/dashboard');

  const account = await getCustodialAccountForStudent(user.id);

  if (!account) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 rounded-2xl p-10 text-center">
          <Settings className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">No wallet found</h2>
          <p className="text-sm text-gray-500 mt-1">Ask your parent to set up your digital wallet first.</p>
        </div>
      </div>
    );
  }

  const cards = await getIssuedCardsForAccount(account.id);

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
        <h1 className="text-2xl font-bold text-gray-900">Wallet Settings</h1>
        <p className="text-gray-600 mt-1">View your wallet configuration and card details.</p>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-500" />
          Account Status
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Verification</span>
            <p className="font-medium text-gray-900 mt-0.5">
              {account.kyc_status === 'fully_verified' ? 'Fully verified (independent)' :
               account.kyc_status === 'adult_verified' ? 'Parent verified' :
               account.kyc_status === 'pending' ? 'Pending verification' : 'Needs attention'}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Approval Mode</span>
            <p className="font-medium text-gray-900 mt-0.5">
              {account.kyc_status === 'fully_verified' ? 'Independent' : 'Dual-approval (Parent + Mentor)'}
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      {cards.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            Virtual Cards
          </h2>
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Futurepreneurs Card</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    card.card_status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                    card.card_status === 'frozen' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {card.card_status === 'active' ? 'Active' :
                     card.card_status === 'frozen' ? 'Frozen (safe)' : 'Cancelled'}
                  </span>
                </div>
                <p className="text-xl font-mono tracking-widest mb-4">
                  •••• •••• •••• {card.last_four}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div>
                    <span>Daily limit</span>
                    <p className="text-white font-medium">{CURRENCY_SYMBOL}{Number(card.spending_limit_daily).toFixed(0)}</p>
                  </div>
                  <div>
                    <span>Weekly limit</span>
                    <p className="text-white font-medium">{CURRENCY_SYMBOL}{Number(card.spending_limit_weekly).toFixed(0)}</p>
                  </div>
                  <div>
                    <span>Per purchase</span>
                    <p className="text-white font-medium">{CURRENCY_SYMBOL}{Number(card.spending_limit_per_transaction).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <h3 className="font-medium mb-1">How your wallet works</h3>
            <ul className="space-y-1 text-blue-700">
              <li>Your card is kept frozen for safety. It&apos;s only activated when a purchase is approved.</li>
              <li>Both your parent and mentor must approve each purchase request.</li>
              <li>After approval, there&apos;s a 1-hour cooling-off period before the card activates.</li>
              <li>Your card is active for 30 minutes — just enough time to make your purchase.</li>
              <li>Remember to upload your receipt after every purchase!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
