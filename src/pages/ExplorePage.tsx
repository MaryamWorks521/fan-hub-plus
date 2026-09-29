import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  ArrowRight,
  User,
  BookOpen,
  Film,
  Calendar,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Zap,
  Sparkles,
  Flame,
  Globe,
  Star,
  Layers,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { ContentItem } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface ExplorePageProps {
  onSelectItem: (item: ContentItem) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onSelectItem, onOpenAuth }) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [sort, setSort] = useState<'latest' | 'popular' | 'alpha'>('latest');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category !== 'all') params.set('category', category);
      if (contentType !== 'all') params.set('contentType', contentType);
      params.set('sort', sort);

      const res = await fetch(`/api/content?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load explorer content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [category, contentType, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContent();
  };

  const categories = [
    { label: 'All Universes', value: 'all', count: '100+' },
    { label: 'Anime & Shonen', value: 'anime', count: '42' },
    { label: 'Cinema & Films', value: 'movies', count: '35' },
    { label: 'Gaming RPGs', value: 'gaming', count: '38' },
    { label: 'Comics & Marvel/DC', value: 'comics', count: '28' },
    { label: 'Manga & Dark Fantasy', value: 'manga', count: '32' },
    { label: 'TV Shows', value: 'tv-shows', count: '26' },
    { label: 'K-Pop Music', value: 'k-pop', count: '18' },
    { label: 'Cosplay Craft', value: 'cosplay', count: '15' }
  ];

  const contentTypes = [
    { label: 'All Content', value: 'all' },
    { label: 'Characters', value: 'character', icon: User },
    { label: 'Articles & Lore', value: 'article', icon: BookOpen },
    { label: '4K Trailers', value: 'video', icon: Film },
    { label: 'Conventions', value: 'event', icon: Calendar },
    { label: 'Collectibles', value: 'merchandise', icon: ShoppingBag }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* ========================================================================= */}
      {/* 1. MODERN ULTRA-SLEEK HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#0e131f] via-[#07090e] to-[#07090e] pt-16 pb-14">
        {/* Soft Ambient Radial Lights (Clean & Modern) */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[750px] rounded-full bg-rose-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-1/4 h-[250px] w-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Modern Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-xl mb-4 shadow-lg shadow-rose-950/20">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">CROSS-FANDOM MULTIVERSE HUB · ANIME, CINEMA & GAMING</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Discover the <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Multiverse</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Explore legendary Anime warriors, blockbuster Cinema sagas, AAA Gaming demigods, and epic fan chronicles in one unified modern portal.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 2. MODERN GLASSMORPHIC SEARCH & FILTERS BAR */}
        {/* ========================================================================= */}
        <div className="mb-10 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 sm:p-5 backdrop-blur-2xl shadow-xl space-y-4">
          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Tanjiro, Gojo, Paul Atreides, Elden Ring, Dune, Batman..."
                className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:border-rose-500/70 focus:bg-black/90 focus:shadow-[0_0_25px_rgba(244,63,94,0.2)] focus:outline-none transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    fetchContent();
                  }}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              <Zap className="h-4 w-4" />
              <span>Search Universe</span>
            </button>
          </form>

          {/* Universe Horizontal Scroll Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/[0.06] pt-3">
            {categories.map(cat => {
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-rose-700 text-white' : 'bg-white/10 text-slate-400'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Content-Type & Sorting Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {contentTypes.map(ct => {
                const active = contentType === ct.value;
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.value}
                    onClick={() => setContentType(ct.value)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                      active
                        ? 'bg-white/10 text-white font-bold border border-white/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    <span>{ct.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                className="rounded-lg border border-white/[0.08] bg-black/60 px-3 py-1.5 text-xs text-slate-200 focus:border-rose-500 focus:outline-none"
              >
                <option value="latest">Latest Releases</option>
                <option value="popular">Highest Rated / Popular</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MODERN CONTENT CARD GRID */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-slate-400 font-medium">Loading multiverse catalog...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map(item => {
              const saved = isBookmarked(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-rose-950/20"
                >
                  {/* Image Stage with Smooth Hover Zoom */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />

                    {/* Top Fandom Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>

                    {/* Bookmark Action */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (!user) {
                          onOpenAuth('login');
                        } else {
                          toggleBookmark({
                            id: item.id,
                            title: item.title,
                            image: item.image,
                            type: item.type,
                            fandom: item.fandom,
                            category: item.category
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

                    {/* Bottom Metadata in Image */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-rose-400">
                        {item.fandom}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {item.popularity}%
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.type}
                    </span>

                    <h3 className="font-display text-base font-bold text-white mt-1 leading-snug group-hover:text-rose-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 border border-white/[0.04]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <span>{item.releaseYear || 'Canon'}</span>
                      <span className="font-semibold text-rose-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-white/[0.08] bg-slate-900/20 p-8">
            <p className="text-sm text-slate-400">No content found matching your filters.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('all');
                setContentType('all');
              }}
              className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
