import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Maximize,
  Minimize,
  X,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { MediaItem } from '../types/index.ts';

interface MovieBoxPlayerProps {
  media: MediaItem;
  autoPlay?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

// Convert any YouTube watch or share URL into a clean, highly reliable iframe embed
function getEmbedUrl(rawUrl: string, autoPlay: boolean): { isEmbed: boolean; url: string; videoId?: string } {
  if (!rawUrl) return { isEmbed: false, url: '' };
  const trimmed = rawUrl.trim();

  // YouTube matchers
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    // Note: If autoplay is requested, modern browsers require mute=1 to allow autoplay.
    // If not autoplaying, autoplay=0 lets the user click and hear audio directly.
    const ap = autoPlay ? '1' : '0';
    const muteParam = autoPlay ? '&mute=1' : '';
    return {
      isEmbed: true,
      videoId,
      url: `https://www.youtube.com/embed/${videoId}?autoplay=${ap}${muteParam}&rel=0&playsinline=1&modestbranding=1`
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isEmbed: true,
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoPlay ? '1' : '0'}`
    };
  }

  // Generic embed
  if (trimmed.includes('/embed/') || trimmed.includes('player.')) {
    return { isEmbed: true, url: trimmed };
  }

  // HTML5 direct video (MP4 / WebM / Blob)
  return { isEmbed: false, url: trimmed };
}

export const MovieBoxPlayer: React.FC<MovieBoxPlayerProps> = ({
  media,
  autoPlay = true,
  onClose,
  isModal = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rawSource = media.videoSource || media.url || '';
  const parsed = getEmbedUrl(rawSource, autoPlay);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
      className={`group relative overflow-hidden rounded-2xl bg-black select-none text-white shadow-2xl transition-all border border-slate-800 ${
        isModal
          ? 'h-[75vh] max-h-[820px] w-full'
          : 'w-full aspect-video min-h-[380px] sm:min-h-[500px]'
      }`}
    >
      {/* 1. MEDIA SCREEN (Either Iframe Embed or HTML5 Video) */}
      {parsed.isEmbed ? (
        <div className="relative h-full w-full bg-black">
          <iframe
            key={parsed.url}
            src={parsed.url}
            title={media.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0 bg-black"
          />
        </div>
      ) : (
        <div className="relative h-full w-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={parsed.url}
            poster={media.thumbnail}
            playsInline
            controls={true}
            autoPlay={autoPlay}
            className="h-full w-full object-contain bg-black"
          />
        </div>
      )}

      {/* 2. TOP FLOATING CONTROL BAR - CLEAN & PROFESSIONAL */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/95 via-black/75 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-rose-900/40">
            <Film className="h-4 w-4" />
            <span>MovieBox Cinema</span>
          </div>

          <div className="hidden sm:block">
            <h4 className="text-sm font-bold text-white truncate max-w-xs md:max-w-md">
              {media.title}
            </h4>
            <span className="text-[11px] text-slate-300 font-mono">
              {media.fandom} · {media.quality || '4K UHD'}
            </span>
          </div>
        </div>

        {/* Action Controls - External Link, Fullscreen & Close */}
        <div className="flex items-center gap-2">
          {/* Direct Stream / Watch External fallback (Guarantees playback on all browsers/adblockers) */}
          {parsed.videoId && (
            <a
              href={`https://www.youtube.com/watch?v=${parsed.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open video directly in high quality"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden md:inline">Open Stream</span>
            </a>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Fullscreen Mode"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-slate-900/80 text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>

          {/* Close button if inside modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-md cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
