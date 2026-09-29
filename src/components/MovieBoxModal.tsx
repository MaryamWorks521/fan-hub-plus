import React from 'react';
import { X, Film, Star, Eye } from 'lucide-react';
import { MediaItem } from '../types/index.ts';
import { MovieBoxPlayer } from './MovieBoxPlayer.tsx';

interface MovieBoxModalProps {
  media: MediaItem | null;
  onClose: () => void;
}

export const MovieBoxModal: React.FC<MovieBoxModalProps> = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white shadow-md">
              <Film className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-sm sm:max-w-xl">
                {media.title}
              </h3>
              <span className="text-xs text-rose-400 font-mono">
                {media.fandom} · {media.category.toUpperCase()} · {media.quality || '4K UHD'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-rose-600 text-white transition-all shadow-md cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player Core */}
        <div className="flex-1 min-h-[300px] sm:min-h-[480px]">
          <MovieBoxPlayer media={media} autoPlay={true} isModal={true} onClose={onClose} />
        </div>

        {/* Video Meta Info */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <p className="line-clamp-2 max-w-2xl text-slate-400 text-xs">
            {media.description}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              {media.rating.toFixed(1)}
            </span>
            <span className="text-slate-500">·</span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              {media.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
