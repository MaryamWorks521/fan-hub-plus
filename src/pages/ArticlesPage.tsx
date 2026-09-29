import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Clock,
  Bookmark,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  Play,
  Film
} from 'lucide-react';
import { Article, MediaItem } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { MovieBoxModal } from '../components/MovieBoxModal.tsx';
import { getMediaForArticle } from '../utils/mediaLauncher.ts';

interface ArticlesPageProps {
  onSelectArticle: (articleId: string) => void;
  onNavigateSubmissions: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({
  onSelectArticle,
  onNavigateSubmissions,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [movieBoxMedia, setMovieBoxMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data.articles || []))
      .catch(err => console.error('Failed to load articles:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredArticles = articles.filter(a => {
    const matchesCat = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.fandom.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* ========================================================================= */}
      {/* 1. MODERN ULTRA-SLEEK HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#0e131f] via-[#07090e] to-[#07090e] pt-16 pb-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[750px] rounded-full bg-rose-600/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-xl mb-4 shadow-lg shadow-rose-950/20">
            <BookOpen className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">CRITICAL ESSAYS & MULTIVERSE LORE</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Fandom <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Chronicles</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            In-depth animation breakdowns (Demon Slayer, Jujutsu Kaisen), cinematic essays (Dune 2, Nolan 70mm), and gaming storytelling analysis.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth('login');
                } else {
                  onNavigateSubmissions();
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit Fan Article</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 2. SEARCH & CATEGORY FILTER */}
        {/* ========================================================================= */}
        <div className="mb-10 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 sm:p-5 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search essays by Demon Slayer, Dune, Nolan, Elden Ring..."
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:border-rose-500/70 focus:bg-black/90 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {[
              { id: 'all', label: 'All Articles' },
              { id: 'anime', label: 'Anime & Shonen' },
              { id: 'movies', label: 'Cinema & Films' },
              { id: 'gaming', label: 'Gaming Lore' },
              { id: 'cosplay', label: 'Cosplay Craft' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODERN ARTICLE CARDS GRID */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-slate-400">Loading editorial archives...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map(art => {
              const saved = isBookmarked(art.id);

              return (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-rose-950/20"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />

                    {/* Bookmark Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (!user) {
                          onOpenAuth('login');
                        } else {
                          toggleBookmark({
                            id: art.id,
                            title: art.title,
                            image: art.coverImage,
                            type: 'article',
                            fandom: art.fandom,
                            category: art.category
                          });
                        }
                      }}
                      title={saved ? 'Saved' : 'Bookmark'}
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
                        saved
                          ? 'border-rose-500 bg-rose-600 text-white shadow-md'
                          : 'border-white/15 bg-black/50 text-slate-300 hover:text-white hover:bg-black/80'
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
                    </button>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                      <span className="text-[10px] font-bold text-rose-300 uppercase">
                        {art.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-300 bg-black/70 px-2.5 py-0.5 rounded-full border border-white/10 font-medium">
                      {art.readTime}
                    </div>

                    {/* Play Hover Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setMovieBoxMedia(getMediaForArticle(art));
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/60 scale-75 group-hover:scale-100 transition-transform duration-300 cursor-pointer"
                        title={`Watch ${art.title} in MovieBox`}
                      >
                        <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">
                      {art.fandom}
                    </span>

                    <h3 className="font-display text-lg font-bold text-white mt-1 leading-snug group-hover:text-rose-400 transition-colors line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {art.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.04]">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setMovieBoxMedia(getMediaForArticle(art));
                        }}
                        className="flex items-center gap-1 font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <Film className="h-3.5 w-3.5" />
                        <span>Watch Cinema</span>
                      </button>
                      <span className="font-semibold text-slate-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Read Essay</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-400">
            No articles found matching your query.
          </div>
        )}
      </div>

      {/* Interactive MovieBox Cinema Modal */}
      <MovieBoxModal
        media={movieBoxMedia}
        onClose={() => setMovieBoxMedia(null)}
      />
    </div>
  );
};
