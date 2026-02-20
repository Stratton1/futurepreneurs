import { GraduationCap, MapPin } from 'lucide-react';

interface StudentProfileCardProps {
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  schoolName?: string | null;
  schoolCity?: string | null;
}

export function StudentProfileCard({
  name,
  avatarUrl,
  bio,
  schoolName,
  schoolCity,
}: StudentProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-3 mb-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-lg font-bold text-emerald-700">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
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
