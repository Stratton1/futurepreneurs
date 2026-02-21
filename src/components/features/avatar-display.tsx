import Image from 'next/image';
import type { AvatarConfig } from '@/types/database';

const SKIN_COLORS: Record<string, string> = {
  light: '#f5d0b0',
  medium: '#d4a574',
  dark: '#8d5524',
};

const HAIR_COLORS: Record<string, string> = {
  brown: '#5c4033',
  black: '#2c1810',
  blonde: '#e6c35c',
};

interface AvatarDisplayProps {
  /** Built avatar config (zero-PII); takes precedence when present. */
  avatarConfig?: AvatarConfig | null;
  /** Fallback image URL (e.g. for teachers/parents who may upload). */
  avatarUrl?: string | null;
  /** Display name for initial letter when no config/url. */
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-lg', lg: 'w-16 h-16 text-xl' };

/** Renders avatar from config (built), URL (photo), or initial letter. */
export function AvatarDisplay({
  avatarConfig,
  avatarUrl,
  name = '',
  size = 'md',
  className = '',
}: AvatarDisplayProps) {
  const sizeClass = sizeClasses[size];

  if (avatarConfig && (avatarConfig.hairStyle || avatarConfig.skinTone)) {
    return (
      <BuiltAvatarSvg
        config={avatarConfig}
        size={size}
        className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}
      />
    );
  }

  if (avatarUrl) {
    const sizePx = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
    return (
      <Image
        src={avatarUrl}
        alt={name || 'Avatar'}
        width={sizePx}
        height={sizePx}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        unoptimized
      />
    );
  }

  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  return (
    <div
      className={`${sizeClass} rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 ${className}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function BuiltAvatarSvg({
  config,
  size,
  className,
}: {
  config: AvatarConfig;
  size: 'sm' | 'md' | 'lg';
  className: string;
}) {
  const sizePx = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
  const skin = SKIN_COLORS[config.skinTone || 'medium'] ?? SKIN_COLORS.medium;
  const hairColor = HAIR_COLORS[config.hairColor || 'brown'] ?? HAIR_COLORS.brown;
  const hasGlasses = config.accessories?.includes('glasses');
  const hasHat = config.accessories?.includes('hat');
  const hairStyle = config.hairStyle || 'short';

  return (
    <svg
      viewBox="0 0 64 64"
      width={sizePx}
      height={sizePx}
      className={className}
      aria-hidden
    >
      {/* Face */}
      <circle cx="32" cy="34" r="18" fill={skin} />
      {/* Hair - short */}
      {hairStyle === 'short' && (
        <path
          d="M18 28 Q20 14 32 16 Q44 14 46 28 Q44 36 32 38 Q20 36 18 28"
          fill={hairColor}
        />
      )}
      {/* Hair - long */}
      {hairStyle === 'long' && (
        <path
          d="M16 26 Q18 8 32 12 Q46 8 48 26 Q46 42 32 44 Q18 42 16 26 L18 52 Q20 58 32 58 Q44 58 46 52 L44 44"
          fill={hairColor}
        />
      )}
      {/* Hair - curly */}
      {hairStyle === 'curly' && (
        <ellipse cx="32" cy="22" rx="20" ry="14" fill={hairColor} />
      )}
      {/* Hat */}
      {hasHat && (
        <path
          d="M14 24 L32 14 L50 24 L48 30 L16 30 Z"
          fill="#4a90d9"
        />
      )}
      {/* Glasses */}
      {hasGlasses && (
        <>
          <circle cx="24" cy="34" r="6" fill="none" stroke="#333" strokeWidth="1.5" />
          <circle cx="40" cy="34" r="6" fill="none" stroke="#333" strokeWidth="1.5" />
          <line x1="30" y1="34" x2="34" y2="34" stroke="#333" strokeWidth="1.5" />
          <line x1="14" y1="30" x2="20" y2="32" stroke="#333" strokeWidth="1" />
          <line x1="50" y1="30" x2="44" y2="32" stroke="#333" strokeWidth="1" />
        </>
      )}
      {/* Eyes */}
      <circle cx="24" cy="34" r="2" fill="#333" />
      <circle cx="40" cy="34" r="2" fill="#333" />
      {/* Smile */}
      <path d="M26 42 Q32 48 38 42" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
