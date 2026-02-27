import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getParentDashboardData } from '@/lib/queries/parent-overview';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { ActivityTimeline } from './activity-timeline';
import { DigestSettings } from './digest-settings';
import { FirstDrawdownBanner } from './first-drawdown-banner';
import Link from 'next/link';
import {
  Users, FolderOpen, TrendingUp, ShieldCheck,
  Wallet, ArrowRight, Clock,
} from 'lucide-react';

export default async function ParentHubPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'parent') {
    redirect('/dashboard');
  }

  const data = await getParentDashboardData(user.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Parent Hub</h1>
        <p className="text-gray-500 mt-1">
          Oversee your children&apos;s projects, spending, and activity
        </p>
      </div>

      {/* First Drawdown Banners */}
      <FirstDrawdownBanner pending={data.firstDrawdownPending} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Children',
            value: data.children.length,
            icon: Users,
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
          },
          {
            label: 'Projects',
            value: data.totalProjects,
            icon: FolderOpen,
            bg: 'bg-emerald-50',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
          },
          {
            label: 'Total Raised',
            value: `${CURRENCY_SYMBOL}${data.totalRaised.toLocaleString('en-GB')}`,
            icon: TrendingUp,
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
          },
          {
            label: 'Pending Actions',
            value: data.pendingConsentCount + data.pendingSpendingCount,
            icon: Clock,
            bg: 'bg-amber-50',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
          },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
            <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      {(data.pendingConsentCount > 0 || data.pendingSpendingCount > 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h2>
          <div className="space-y-3">
            {data.pendingConsentCount > 0 && (
              <Link
                href="/dashboard/consent"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {data.pendingConsentCount} consent request{data.pendingConsentCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">Review and approve your child&apos;s projects</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            )}
            {data.pendingSpendingCount > 0 && (
              <Link
                href="/dashboard/wallet/parent"
                className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {data.pendingSpendingCount} spending approval{data.pendingSpendingCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500">Review your child&apos;s purchase requests</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Children & Projects — 2-column span */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Children &amp; Projects</h2>
            {data.children.length === 0 ? (
              <p className="text-sm text-gray-500">
                No children linked to your account yet. Students can link their parent during sign-up.
              </p>
            ) : (
              <div className="space-y-6">
                {data.children.map((child) => (
                  <div key={child.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-700">
                          {child.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{child.full_name}</p>
                        <p className="text-xs text-gray-400">{child.email}</p>
                      </div>
                    </div>
                    {child.projects.length === 0 ? (
                      <p className="text-xs text-gray-400 ml-10">No projects yet</p>
                    ) : (
                      <div className="space-y-2 ml-10">
                        {child.projects.map((project) => {
                          const pct = project.goal_amount > 0
                            ? Math.min(100, Math.round((project.total_raised / project.goal_amount) * 100))
                            : 0;
                          return (
                            <div key={project.id} className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {project.title}
                                </p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  project.status === 'live' ? 'bg-emerald-100 text-emerald-700' :
                                  project.status === 'funded' ? 'bg-blue-100 text-blue-700' :
                                  project.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-emerald-500 transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {CURRENCY_SYMBOL}{project.total_raised.toLocaleString('en-GB')} / {CURRENCY_SYMBOL}{project.goal_amount.toLocaleString('en-GB')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — activity + digest */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <ActivityTimeline events={data.recentEvents} />
          </div>

          {/* Digest Settings */}
          <DigestSettings
            initialEnabled={data.digestSettings?.digest_enabled ?? true}
            initialDay={data.digestSettings?.digest_day ?? 'monday'}
          />
        </div>
      </div>
    </div>
  );
}
