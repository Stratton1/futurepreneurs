import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { getAllSponsors } from '@/lib/queries/matching';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import Link from 'next/link';
import { Building2, GraduationCap, Plus } from 'lucide-react';
import { CreateSponsorForm } from './create-sponsor-form';

export default async function AdminMatchingPage() {
  await requireAdmin();

  const sponsors = await getAllSponsors();
  const corporate = sponsors.filter((s) => s.sponsor_type === 'corporate');
  const grant = sponsors.filter((s) => s.sponsor_type === 'grant');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matching Sponsors</h1>
          <p className="text-gray-600 mt-1">
            Manage corporate matching and youth grant sponsors.
          </p>
        </div>
      </div>

      {/* Corporate Sponsors */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-amber-500" />
        Corporate Sponsors ({corporate.length})
      </h2>

      {corporate.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-500 text-sm">No corporate sponsors yet.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {corporate.map((sponsor) => (
            <SponsorRow key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      )}

      {/* Grant Sponsors */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-purple-500" />
        Youth Grant Programmes ({grant.length})
      </h2>

      {grant.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-500 text-sm">No grant programmes yet.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {grant.map((sponsor) => (
            <SponsorRow key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      )}

      {/* Create new */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Sponsor
        </h2>
        <CreateSponsorForm />
      </div>
    </div>
  );
}

function SponsorRow({ sponsor }: { sponsor: { id: string; name: string; sponsor_type: string; match_ratio: number; total_budget: number; total_matched: number; is_active: boolean } }) {
  const usagePercent = Number(sponsor.total_budget) > 0
    ? Math.round((Number(sponsor.total_matched) / Number(sponsor.total_budget)) * 100)
    : 0;

  return (
    <Link href={`/admin/matching/${sponsor.id}`}>
      <div className={`bg-white rounded-xl border p-4 hover:border-emerald-200 transition-colors ${
        sponsor.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{sponsor.name}</span>
              {!sponsor.is_active && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {sponsor.match_ratio}x match &middot;{' '}
              {CURRENCY_SYMBOL}{Number(sponsor.total_matched).toLocaleString()} /{' '}
              {CURRENCY_SYMBOL}{Number(sponsor.total_budget).toLocaleString()} used ({usagePercent}%)
            </p>
          </div>
          <div className="w-24 bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(100, usagePercent)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
