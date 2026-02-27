import { Clock, CheckCircle2, XCircle, FileText, Heart, Target, Lightbulb } from 'lucide-react';
import FundsBreakdownTable from './funds-breakdown-table';

interface ProjectUpdateCardProps {
  update: {
    id: string;
    title: string;
    content: string;
    update_type: string;
    images: string[];
    funds_breakdown: { label: string; amount: number }[] | null;
    learnings: string | null;
    status: string;
    rejection_reason?: string | null;
    created_at: string;
    author?: { full_name: string } | null;
  };
  showStatus?: boolean;
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof FileText; colour: string }> = {
  general: { label: 'General Update', icon: FileText, colour: 'text-blue-600 bg-blue-50' },
  impact_report: { label: 'Impact Report', icon: Target, colour: 'text-emerald-600 bg-emerald-50' },
  milestone_complete: { label: 'Milestone Complete', icon: CheckCircle2, colour: 'text-purple-600 bg-purple-50' },
  thank_you: { label: 'Thank You', icon: Heart, colour: 'text-pink-600 bg-pink-50' },
};

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; colour: string }> = {
  pending: { label: 'Pending Review', icon: Clock, colour: 'text-amber-700 bg-amber-50 border-amber-200' },
  approved: { label: 'Published', icon: CheckCircle2, colour: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Rejected', icon: XCircle, colour: 'text-red-700 bg-red-50 border-red-200' },
};

export default function ProjectUpdateCard({ update, showStatus = false }: ProjectUpdateCardProps) {
  const typeInfo = TYPE_CONFIG[update.update_type] || TYPE_CONFIG.general;
  const TypeIcon = typeInfo.icon;
  const statusInfo = STATUS_CONFIG[update.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusInfo.icon;

  const date = new Date(update.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.colour}`}
            >
              <TypeIcon className="h-3 w-3" />
              {typeInfo.label}
            </span>
            {showStatus && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusInfo.colour}`}
              >
                <StatusIcon className="h-3 w-3" />
                {statusInfo.label}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900">{update.title}</h3>
        </div>
        <p className="text-xs text-gray-400 whitespace-nowrap">{date}</p>
      </div>

      {/* Author */}
      {update.author?.full_name && (
        <p className="text-xs text-gray-500">
          Posted by {update.author.full_name}
        </p>
      )}

      {/* Content */}
      <div className="text-sm text-gray-700 whitespace-pre-wrap">{update.content}</div>

      {/* Funds breakdown */}
      {update.funds_breakdown && update.funds_breakdown.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">How funds were spent</p>
          <FundsBreakdownTable rows={update.funds_breakdown} />
        </div>
      )}

      {/* Learnings */}
      {update.learnings && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-xs font-medium text-amber-700">What I learned</p>
          </div>
          <p className="text-sm text-amber-900">{update.learnings}</p>
        </div>
      )}

      {/* Rejection reason */}
      {update.status === 'rejected' && update.rejection_reason && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <p className="text-xs font-medium text-red-700 mb-0.5">Reason</p>
          <p className="text-sm text-red-800">{update.rejection_reason}</p>
        </div>
      )}
    </div>
  );
}
