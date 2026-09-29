import React, { useState } from 'react';
import { X, Bookmark, ExternalLink, Calendar, MapPin, Tag, Star, User, Film, Clock, Play } from 'lucide-react';
import { ContentItem, MediaItem } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/useAuth';

interface ContentDetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onWatchCinema?: (media: MediaItem) => void;
}

export const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  item,
  onClose,
  onOpenAuth,
  onWatchCinema
}) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark, getBookmark, updateNotes } = useBookmarks();
  const [noteDraft, setNoteDraft] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!item) return null;

  const saved = isBookmarked(item.id);
  const bookmarkObj = getBookmark(item.id);

  const handleSaveNote = async () => {
    if (bookmarkObj && noteDraft.trim()) {
      await updateNotes(bookmarkObj.id, noteDraft.trim());
      setShowNoteInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-slate-950/70 p-2 text-slate-400 hover:text-white backdrop-blur-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Thumbnail / Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={item.image}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              {item.category} · {item.type}
            </span>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              {item.title}
            </h2>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-300">
              <span>{item.fandom}</span>
              <span>·</span>
              <span className="text-amber-400 tabular-nums">★ {item.rating}</span>
              <span>·</span>
              <span>Release: {item.releaseYear}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description & Full Narrative */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview & Fandom Lore
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
              {item.fullText || item.description}
            </p>
          </div>

          {/* Specific Metadata fields */}
          <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-800 py-3 text-xs">
            {item.author && (
              <div>
                <span className="text-slate-500">Author / Creator:</span>
                <p className="font-semibold text-white mt-0.5">{item.author}</p>
              </div>
            )}
            {item.venue && (
              <div>
                <span className="text-slate-500">Venue & City:</span>
                <p className="font-semibold text-white mt-0.5">
                  {item.venue}, {item.city}
                </p>
              </div>
            )}
            {item.price && (
              <div>
                <span className="text-slate-500">Price / Valuation:</span>
                <p className="font-semibold text-white mt-0.5">{item.price}</p>
              </div>
            )}
            {item.duration && (
              <div>
                <span className="text-slate-500">Duration:</span>
                <p className="font-semibold text-white mt-0.5">{item.duration}</p>
              </div>
            )}
            <div>
              <span className="text-slate-500">Genre / Focus:</span>
              <p className="font-semibold text-white mt-0.5">{item.genre || 'General Fandom'}</p>
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-500 mr-2">Tags:</span>
              {item.tags.map(t => (
                <span key={t} className="mr-2 text-xs text-slate-400">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Saved Personal Notes (if bookmarked) */}
          {saved && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Your Private Note</span>
                {!showNoteInput && (
                  <button
                    onClick={() => {
                      setNoteDraft(bookmarkObj?.notes || '');
                      setShowNoteInput(true);
                    }}
                    className="text-rose-400 hover:underline text-[11px]"
                  >
                    {bookmarkObj?.notes ? 'Edit Note' : 'Add Note'}
                  </button>
                )}
              </div>

              {showNoteInput ? (
                <div className="space-y-2 mt-2">
                  <textarea
                    rows={2}
                    value={noteDraft}
                    onChange={e => setNoteDraft(e.target.value)}
                    placeholder="Write a personal note for your research archive..."
                    className="w-full rounded bg-slate-900 p-2 text-xs text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowNoteInput(false)}
                      className="px-2 py-0.5 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="rounded bg-rose-600 px-3 py-1 text-xs font-bold text-white"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {bookmarkObj?.notes || 'No private note attached yet.'}
                </p>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {onWatchCinema && (
                <button
                  onClick={() => {
                    const mediaObj: MediaItem = {
                      id: item.id,
                      title: item.title,
                      category: item.category,
                      fandom: item.fandom,
                      type: 'movie',
                      url: item.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                      videoSource: item.mediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                      thumbnail: item.image,
                      duration: item.duration || '12:14',
                      description: item.description,
                      rating: item.rating,
                      views: item.popularity || 840000,
                      tags: item.tags || [item.category, item.fandom],
                      quality: '4K UHD'
                    };
                    onWatchCinema(mediaObj);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:from-rose-500 hover:to-rose-400 active:scale-95 transition-all"
                >
                  <Play className="h-4 w-4" fill="currentColor" />
                  <span>Stream in MovieBox</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth('login');
                  } else {
                    toggleBookmark(item);
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                  saved
                    ? 'bg-rose-600 text-white'
                    : 'border border-slate-700 bg-slate-800 text-slate-200 hover:text-white'
                }`}
              >
                <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
                <span>{saved ? 'In Bookmarks' : 'Save'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
