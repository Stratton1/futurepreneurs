import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/auth-helpers';
import { getSponsorById, getPledgesForSponsor } from '@/lib/queries/matching';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import { SponsorActions } from './sponsor-actions';
import { AssignProjectForm } from './assign-project-form';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SponsorDetailPage({ params }: Props) {
  const { id } = await params;
  await requireAdmin();

  const sponsor = await getSponsorById(id);
  if (!sponsor) notFound();

  const pledges = await getPledgesForSponsor(id);
  const usagePercent = Number(sponsor.total_budget) > 0
    ? Math.round((Number(sponsor.total_matched) / Number(sponsor.total_budget)) * 100)
    : 0;

  return (
    <div>
      <Link
        href="/admin/matching"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sponsors
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{sponsor.name}</h1>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                sponsor.sponsor_type === 'corporate'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-purple-50 text-purple-700'
              }`}
            >
              {sponsor.sponsor_type === 'corporate' ? 'Corporate' : 'Grant'}
            </span>
            {!sponsor.is_active && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                Inactive
              </span>
            )}
          </div>
          {sponsor.description && (
            <p className="text-gray-600 mt-1">{sponsor.description}</p>
          )}
        </div>
        <SponsorActions sponsorId={id} isActive={sponsor.is_active} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Match Ratio" value={`${sponsor.match_ratio}x`} />
        <StatCard label="Max per Project" value={`${CURRENCY_SYMBOL}${Number(sponsor.max_match_per_project).toLocaleString()}`} />
        <StatCard label="Total Budget" value={`${CURRENCY_SYMBOL}${Number(sponsor.total_budget).toLocaleString()}`} />
        <StatCard label="Total Matched" value={`${CURRENCY_SYMBOL}${Number(sponsor.total_matched).toLocaleString()} (${usagePercent}%)`} />
      </div>

      {/* Budget usage bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
        <p className="text-sm font-medium text-gray-700 mb-2">Budget Usage</p>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, usagePercent)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {CURRENCY_SYMBOL}{(Number(sponsor.total_budget) - Number(sponsor.total_matched)).toLocaleString()} remaining
        </p>
      </div>

      {/* Pledged Projects */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Assigned Projects ({pledges.length})
      </h2>

      {pledges.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center mb-6">
          <p className="text-gray-500 text-sm">No projects assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {pledges.map((pledge) => (
            <div key={pledge.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{pledge.project_title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {pledge.match_ratio}x match &middot;{' '}
                    {CURRENCY_SYMBOL}{Number(pledge.matched_amount).toFixed(2)} /{' '}
                    {CURRENCY_SYMBOL}{Number(pledge.max_match_amount).toFixed(2)} used
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    pledge.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {pledge.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign to project */}
      {sponsor.is_active && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Assign to Project</h3>
          <AssignProjectForm sponsorId={id} />
        </div>
      )}

      {/* Contact */}
      {sponsor.contact_email && (
        <p className="text-xs text-gray-400 mt-6">
          Contact: {sponsor.contact_email}
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}
