'use client';

import { useState } from 'react';
import { Play, ExternalLink, AlertTriangle } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  title?: string;
}

/**
 * Parses a YouTube or Vimeo URL into a privacy-enhanced embed URL.
 * Returns null for unsupported URLs.
 */
function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'm.youtube.com'
    ) {
      const videoId = parsed.searchParams.get('v');
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
      // /embed/ path
      const embedMatch = parsed.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})$/);
      if (embedMatch) {
        return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}?rel=0&modestbranding=1`;
      }
    }

    // youtu.be short URLs
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    }

    // Vimeo: vimeo.com/ID
    if (parsed.hostname === 'vimeo.com' || parsed.hostname === 'www.vimeo.com') {
      const vimeoId = parsed.pathname.match(/^\/(\d+)/);
      if (vimeoId) {
        return `https://player.vimeo.com/video/${vimeoId[1]}?dnt=1`;
      }
    }
  } catch {
    // Invalid URL
  }

  return null;
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = getEmbedUrl(url);

  // If we can't parse the URL, show a safe link instead
  if (!embedUrl) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700">
            Video link provided but we can&apos;t embed it. Only YouTube and Vimeo videos can be shown inline.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-1"
          >
            Open video in new tab <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Show a click-to-load placeholder (privacy-friendly: no iframe until user opts in)
  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden group cursor-pointer"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
            <Play className="h-8 w-8 text-white ml-1" />
          </div>
          <span className="text-white/80 text-sm mt-3">
            {title || 'Click to load video'}
          </span>
          <span className="text-white/50 text-xs mt-1">
            {url.includes('youtube') || url.includes('youtu.be') ? 'YouTube' : 'Vimeo'} (privacy-enhanced mode)
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={title || 'Project video'}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
