import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getPendingRequestsForMentor, getAllRequestsForMentor } from '@/lib/queries/spending-requests';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import {
  Wallet, Clock, CheckCircle, XCircle, AlertTriangle, BookOpen,
} from 'lucide-react';
import { MentorApprovalActions } from './mentor-approval-actions';

export default async function MentorWalletPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const pendingRequests = await getPendingRequestsForMentor(user.id);
  const allRequests = await getAllRequestsForMentor(user.id);
  const recentActivity = allRequests
    .filter((r) => r.status !== 'pending_mentor' && r.status !== 'pending_parent')
    .slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Spending</h1>
        <p className="text-gray-600 mt-1">
          Review and approve purchase requests from your mentored students.
          Only requests already approved by a parent appear here.
        </p>
      </div>

      {/* Pending Mentor Approval */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Needs Your Approval
          {pendingRequests.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No pending approvals.</p>
            <p className="text-sm text-gray-500 mt-1">
              Requests will appear here after a parent has approved them.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-blue-200 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Parent approved
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {req.student_name} — {CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Vendor:</span> {req.vendor_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      <span className="font-medium">Reason:</span> {req.reason}
                    </p>
                    {req.project_title && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {req.project_title}
                      </p>
                    )}
                    {req.milestone_title && (
                      <p className="text-xs text-gray-400">Milestone: {req.milestone_title}</p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-gray-900 flex-shrink-0">
                    {CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}
                  </p>
                </div>
                <MentorApprovalActions requestId={req.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {recentActivity.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {req.status === 'completed' || req.status === 'funded' || req.status === 'approved' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  ) : req.status === 'declined_mentor' ? (
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{req.vendor_name}</p>
                    <p className="text-xs text-gray-500">
                      {req.student_name} &middot; {req.project_title}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    {CURRENCY_SYMBOL}{Number(req.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{req.status.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
