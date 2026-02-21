import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { createAdminClient } from '@/lib/supabase/server';
import { Store, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { VendorForm } from './vendor-form';

export default async function VendorAllowlistPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'teacher') redirect('/dashboard');

  const { projectId } = await params;
  const admin = createAdminClient();

  // Verify project and mentorship
  const { data: project } = await admin
    .from('projects')
    .select('id, title, mentor_id')
    .eq('id', projectId)
    .single();

  if (!project || project.mentor_id !== user.id) {
    redirect('/dashboard');
  }

  const { data: vendors } = await admin
    .from('vendor_allowlists')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard/wallet/mentor"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Spending Dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Allowlist</h1>
        <p className="text-gray-600 mt-1">
          Manage approved vendors for <strong>{project.title}</strong>.
          If any vendors are listed, students can only request purchases from these vendors.
        </p>
      </div>

      {/* Add Vendor Form */}
      <VendorForm projectId={projectId} />

      {/* Current Vendors */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Approved Vendors
          {(!vendors || vendors.length === 0) && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (no restrictions — all vendors allowed)
            </span>
          )}
        </h2>

        {vendors && vendors.length > 0 ? (
          <div className="space-y-2">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Store className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{v.vendor_name}</p>
                    {v.vendor_mcc && (
                      <p className="text-xs text-gray-500">MCC: {v.vendor_mcc}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(v.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <Store className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No vendor restrictions set.</p>
            <p className="text-sm text-gray-500 mt-1">
              Add vendors above to restrict where students can spend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
