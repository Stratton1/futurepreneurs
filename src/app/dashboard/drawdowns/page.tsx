import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getPendingDrawdownsForTeacher, getDrawdownsForParent } from '@/lib/queries/drawdowns';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Banknote, Eye } from 'lucide-react';
import { DrawdownApprovalActions } from './drawdown-approval-actions';

export default async function DrawdownsPage() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'teacher' && user.role !== 'parent') redirect('/dashboard');

  if (user.role === 'teacher') {
    const pending = await getPendingDrawdownsForTeacher(user.id);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Drawdown Requests</h1>
          <p className="text-gray-600 mt-1">Approve or reject funding requests from your students.</p>
        </div>

        {pending.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <Banknote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No pending requests</h2>
            <p className="text-gray-500">When your students request drawdowns for funded projects, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-wrap items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{d.project_title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">by {d.student_name}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">{d.milestone_title}</span>
                    {' — '}
                    {CURRENCY_SYMBOL}{d.amount.toFixed(2)} of {CURRENCY_SYMBOL}{d.milestone_amount.toFixed(2)}
                  </p>
                  {d.reason && (
                    <p className="text-sm text-gray-600 mt-1">Reason: {d.reason}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Requested {new Date(d.requested_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                  </p>
                </div>
                <DrawdownApprovalActions drawdownId={d.id} projectId={d.project_id} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Parent view: read-only list
  const drawdowns = await getDrawdownsForParent(user.id);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Drawdown Activity</h1>
        <p className="text-gray-600 mt-1">View funding requests and approvals for your child&apos;s projects.</p>
      </div>

      {drawdowns.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No drawdown activity yet</h2>
          <p className="text-gray-500">When your child requests or receives drawdowns, they will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 font-medium">
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Milestone</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Requested</th>
                <th className="pb-3">Approved / Rejected</th>
              </tr>
            </thead>
            <tbody>
              {drawdowns.map((d) => (
                <tr key={d.id} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-900">{d.project_title}</td>
                  <td className="py-3 pr-4 text-gray-700">{d.student_name}</td>
                  <td className="py-3 pr-4 text-gray-700">{d.milestone_title}</td>
                  <td className="py-3 pr-4">{CURRENCY_SYMBOL}{d.amount.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        d.status === 'approved'
                          ? 'text-emerald-600 font-medium'
                          : d.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-amber-600'
                      }
                    >
                      {d.status === 'pending' && 'Pending'}
                      {d.status === 'approved' && 'Approved'}
                      {d.status === 'rejected' && 'Not approved'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">
                    {new Date(d.requested_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3 text-gray-500">
                    {d.approved_at
                      ? new Date(d.approved_at).toLocaleDateString('en-GB')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
