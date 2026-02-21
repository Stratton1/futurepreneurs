'use client';

import {
  Rocket, Lightbulb, Star, Heart, Zap, Award, ShoppingBag, Utensils,
  Paintbrush, Music, Camera, Code, Leaf, BookOpen, Sparkles, Wrench,
  Globe, Crown, TrendingUp, Gift,
} from 'lucide-react';
import {
  getTemplate,
  getPalette,
  getIcon,
  type LogoConfig,
} from '@/lib/logo-templates';

const ICON_MAP: Record<string, React.FC<{ className?: string; color?: string }>> = {
  Rocket, Lightbulb, Star, Heart, Zap, Award, ShoppingBag, Utensils,
  Paintbrush, Music, Camera, Code, Leaf, BookOpen, Sparkles, Wrench,
  Globe, Crown, TrendingUp, Gift,
};

interface LogoPreviewProps {
  config: LogoConfig;
  size?: number;
  className?: string;
}

export function LogoPreview({ config, size = 160, className = '' }: LogoPreviewProps) {
  const template = getTemplate(config.templateId);
  const palette = getPalette(config.paletteId);
  const iconDef = getIcon(config.iconId);
  const IconComponent = ICON_MAP[iconDef.icon];

  // Parse viewBox for positioning
  const [, , vbW, vbH] = template.viewBox.split(' ').map(Number);
  const cx = vbW / 2;
  const cy = vbH / 2;

  // Icon is above text, text is below
  const hasText = config.businessName.trim().length > 0;
  const iconY = hasText ? cy - 15 : cy;
  const textY = cy + 30;
  const iconSize = 48;

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size * (vbH / vbW) }}>
      <svg
        viewBox={template.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        {/* Background shape */}
        <g dangerouslySetInnerHTML={{ __html: template.renderShape(palette.primary) }} />

        {/* Icon */}
        {IconComponent && (
          <foreignObject
            x={cx - iconSize / 2}
            y={iconY - iconSize / 2}
            width={iconSize}
            height={iconSize}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent className="w-full h-full" color={palette.text} />
            </div>
          </foreignObject>
        )}

        {/* Business name */}
        {hasText && (
          <text
            x={cx}
            y={textY}
            textAnchor="middle"
            fill={palette.text}
            fontSize={config.fontSize}
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {config.businessName.slice(0, 20)}
          </text>
        )}
      </svg>
    </div>
  );
}
