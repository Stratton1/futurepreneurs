import { GraduationCap, MapPin } from 'lucide-react';
import { AvatarDisplay } from './avatar-display';
import type { AvatarConfig } from '@/types/database';

interface StudentProfileCardProps {
  /** Fallback name (e.g. full_name) when displayHandle not set */
  name: string;
  /** Public display handle (e.g. BrightSpark42); shown instead of name when set */
  displayHandle?: string | null;
  avatarUrl?: string | null;
  avatarConfig?: AvatarConfig | null;
  bio?: string | null;
  schoolName?: string | null;
  schoolCity?: string | null;
}

export function StudentProfileCard({
  name,
  displayHandle,
  avatarUrl,
  avatarConfig,
  bio,
  schoolName,
  schoolCity,
}: StudentProfileCardProps) {
  const displayName = displayHandle?.trim() || name;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        <AvatarDisplay
          avatarConfig={avatarConfig}
          avatarUrl={avatarUrl}
          name={displayName}
          size="md"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{displayName}</h3>
          <p className="text-xs text-gray-500">Young Entrepreneur</p>
        </div>
      </div>

      {bio && (
        <p className="text-sm text-gray-600 mb-3">{bio}</p>
      )}

      {schoolName && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <GraduationCap className="h-4 w-4 text-gray-400" />
          <span>{schoolName}</span>
          {schoolCity && (
            <>
              <MapPin className="h-3.5 w-3.5 text-gray-400 ml-1" />
              <span>{schoolCity}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
