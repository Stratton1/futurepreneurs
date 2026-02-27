import { ShieldCheck } from 'lucide-react';

interface VerificationBadgeProps {
  mentorName: string;
  schoolName?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ mentorName, schoolName, size = 'md' }: VerificationBadgeProps) {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-1 text-blue-600">
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="text-[10px] font-medium truncate">Verified</span>
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div className="flex items-center gap-1.5 text-blue-600">
        <ShieldCheck className="h-4 w-4 flex-shrink-0" />
        <span className="text-xs font-medium">
          Verified by {mentorName}
        </span>
      </div>
    );
  }

  // size === 'lg' — full card for detail page
  return (
    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-semibold text-blue-900">Verified project</span>
      </div>
      <p className="text-sm text-blue-700">
        This project has been reviewed and approved by{' '}
        <strong>{mentorName}</strong>
        {schoolName && <span> at {schoolName}</span>}.
      </p>
      <p className="text-xs text-blue-500 mt-2">
        All projects on Futurepreneurs are verified by a teacher or mentor at the student&apos;s school before going live.
      </p>
    </div>
  );
}
