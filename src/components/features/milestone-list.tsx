import { Check, Clock, Banknote } from 'lucide-react';
import { CURRENCY_SYMBOL } from '@/lib/constants';

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  sort_order: number;
  status: string;
}

interface MilestoneListProps {
  milestones: Milestone[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="space-y-3">
      {milestones.map((milestone, index) => {
        const statusIcon = {
          pending: <Clock className="h-4 w-4 text-gray-400" />,
          approved: <Check className="h-4 w-4 text-emerald-500" />,
          disbursed: <Banknote className="h-4 w-4 text-blue-500" />,
        }[milestone.status] || <Clock className="h-4 w-4 text-gray-400" />;

        const statusColor = {
          pending: 'border-gray-200 bg-white',
          approved: 'border-emerald-200 bg-emerald-50',
          disbursed: 'border-blue-200 bg-blue-50',
        }[milestone.status] || 'border-gray-200 bg-white';

        return (
          <div key={milestone.id} className={`rounded-xl border p-4 ${statusColor}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{milestone.title}</h4>
                  {milestone.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{milestone.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-900">
                  {CURRENCY_SYMBOL}{milestone.amount.toLocaleString('en-GB')}
                </span>
                {statusIcon}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
