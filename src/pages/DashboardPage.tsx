import React, { useState, useEffect } from 'react';
import {
  Compass,
  Bookmark,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  Trash2,
  Edit3,
  Check,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Activity,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { ContentItem } from '../types/index.ts';

interface DashboardPageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectContent: (item: ContentItem) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectContent,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { bookmarks, removeBookmark, updateNotes } = useBookmarks();

  const [bookmarkSearch, setBookmarkSearch] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    fetch('/api/content?sort=popular')
      .then(res => res.json())
      .then(data => {
        setRecommendations(data.items?.slice(0, 4) || []);
      })
      .catch(err => console.error('Failed to load recommendations:', err))
      .finally(() => setLoadingRecs(false));
  }, []);

  const handleStartEditNote = (bookmarkId: string, currentNote: string) => {
    setEditingNoteId(bookmarkId);
    setNoteDraft(currentNote || '');
  };

  const handleSaveNote = async (bookmarkId: string) => {
    await updateNotes(bookmarkId, noteDraft);
    setEditingNoteId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-black text-white">
            Personal Command Center
          </h1>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Log in to access your personal fandom lore vault, saved bookmarks with private notes, and custom universe recommendations.
          </p>
          <button
            onClick={() => onOpenAuth('login')}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
          >
            Sign In to Hub
          </button>
        </div>
      </div>
    );
  }

  const filteredBookmarks = bookmarks.filter(b => {
    const q = bookmarkSearch.toLowerCase();
    return (
      b.contentTitle.toLowerCase().includes(q) ||
      (b.notes && b.notes.toLowerCase().includes(q)) ||
      (b.fandom && b.fandom.toLowerCase().includes(q)) ||
      (b.contentType && b.contentType.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-12 sm:py-16">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-rose-600/10 blur-[130px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* User Identity */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-rose-500/50 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow">
                    ✓
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                      {user.name}
                    </h1>
                    <span className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-300 uppercase">
                      {user.role}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400 font-mono">
                    Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} · Account Active
                  </p>

                  {/* Fan XP / Level Progress Bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-rose-400">LVL 14 ARCHIVIST</span>
                    <div className="h-2 w-36 sm:w-48 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full w-[82%]" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">4,250 / 5,000 XP</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => onNavigate('profile')}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-mono font-bold text-slate-200 hover:text-white transition-colors"
                >
                  Preferences
                </button>
                <button
                  onClick={() => onNavigate('submissions')}
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
                >
                  Submit Fan Content
                </button>
              </div>
            </div>

            {/* Favorite Fandoms Tags */}
            <div className="mt-6 border-t border-slate-800/80 pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 mr-2 uppercase">Orbit Fandoms:</span>
              {user.favoriteFandoms?.map(f => (
                <span
                  key={f}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-mono text-rose-300"
                >
                  ★ {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Bookmarked Items & Notes System */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-rose-500" />
                <span>Personal Lore Vault ({bookmarks.length})</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Bookmarks and private analytical research notes stored in database.
              </p>
            </div>

            {/* Search Bookmarks */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={bookmarkSearch}
                onChange={e => setBookmarkSearch(e.target.value)}
                placeholder="Search your notes or titles..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 pl-9 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {filteredBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBookmarks.map(bm => (
                <div
                  key={bm.id}
                  className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-slate-700"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <img
                        src={bm.contentImage}
                        alt={bm.contentTitle}
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-2xl object-cover shrink-0 border border-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase">
                            {bm.contentType} · {bm.fandom || bm.category}
                          </span>
                          <button
                            onClick={() => removeBookmark(bm.id)}
                            title="Remove bookmark"
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                          {bm.contentTitle}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          Saved on {new Date(bm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Private Personal Notes */}
                    <div className="mt-4 rounded-2xl border border-slate-800/90 bg-slate-950 p-3 shadow-inner">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1.5 font-bold text-slate-300">
                          <FileText className="h-3.5 w-3.5 text-indigo-400" />
                          Private Lore Notes
                        </span>
                        {editingNoteId !== bm.id && (
                          <button
                            onClick={() => handleStartEditNote(bm.id, bm.notes || '')}
                            className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <Edit3 className="h-2.5 w-2.5" />
                            {bm.notes ? 'Edit Note' : 'Add Note'}
                          </button>
                        )}
                      </div>

                      {editingNoteId === bm.id ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            value={noteDraft}
                            onChange={e => setNoteDraft(e.target.value)}
                            rows={2}
                            placeholder="Type confidential lore notes or theories..."
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-rose-500 focus:outline-none font-mono"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="rounded-lg px-2.5 py-1 text-[10px] font-mono text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(bm.id)}
                              className="rounded-lg bg-rose-600 px-3 py-1 text-[10px] font-mono font-bold text-white hover:bg-rose-500 flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic line-clamp-2">
                          {bm.notes || 'No private notes yet. Click Add Note to attach observations.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500 font-mono rounded-3xl border border-slate-900 bg-slate-900/40">
              No bookmarked items found in vault. Browse character dossiers and articles to bookmark!
            </div>
          )}
        </section>

        {/* 3. Recommended Universe Drops */}
        {recommendations.length > 0 && (
          <section className="border-t border-slate-800/80 pt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span>Curated for Your Interests</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Algorithmic suggestions based on your preferred fandoms</p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-mono font-bold text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Full Explorer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectContent(item)}
                  className="group cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-950 mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[9px] font-mono text-rose-300 uppercase">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{item.type.toUpperCase()}</span>
                    <span className="text-rose-400 font-bold group-hover:underline">Explore →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
