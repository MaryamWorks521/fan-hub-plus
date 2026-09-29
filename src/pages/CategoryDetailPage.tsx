import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Search,
  SlidersHorizontal,
  User,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Shield,
  Star,
  Zap
} from 'lucide-react';
import {
  FandomCategory,
  Character,
  Article,
  MediaItem,
  FandomEvent,
  MerchandiseItem,
  UpcomingRelease,
  ContentItem
} from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface CategoryDetailPageProps {
  categorySlug: string;
  onBack: () => void;
  onSelectContent: (item: ContentItem) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categorySlug,
  onBack,
  onSelectContent,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [category, setCategory] = useState<FandomCategory | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [events, setEvents] = useState<FandomEvent[]>([]);
  const [merchandise, setMerchandise] = useState<MerchandiseItem[]>([]);
  const [releases, setReleases] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'all' | 'characters' | 'articles' | 'media' | 'events' | 'merch' | 'upcoming'>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'popular' | 'alpha'>('latest');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/categories/${categorySlug}`)
      .then(res => res.json())
      .then(data => {
        setCategory(data.category || null);
        setCharacters(data.characters || []);
        setArticles(data.articles || []);
        setMedia(data.media || []);
        setEvents(data.events || []);
        setMerchandise(data.merchandise || []);
        setReleases(data.releases || []);
      })
      .catch(err => console.error('Failed to load category details:', err))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-xs text-slate-500 font-mono">
        Opening fandom portal vault...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-base text-slate-300">Category not found.</p>
        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* 1. Category Hero Banner with Breadcrumbs & Cosmic Lighting */}
      <div className="relative min-h-[380px] w-full overflow-hidden border-b border-slate-800 bg-slate-950 flex flex-col justify-between p-6 sm:p-10">
        <img
          src={category.coverImage}
          alt={category.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40 brightness-90 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        
        {/* Subtle red background nebula aura */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[500px] rounded-full bg-rose-600/15 blur-[120px]" />

        {/* Top Breadcrumb Bar (SRS 1.6 Requirement: Breadcrumbs for navigation clarity) */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button onClick={onBack} className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Portals</span>
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-white font-bold uppercase">{category.name}</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/80 px-3.5 py-1 text-xs font-mono text-slate-300 backdrop-blur-md">
            <span>{category.itemCount} Curated Records In Archive</span>
          </div>
        </div>

        {/* Bottom Title & Description */}
        <div className="relative z-10 max-w-3xl mt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 backdrop-blur-md mb-3">
            <Sparkles className="h-3 w-3 text-rose-400" />
            <span>AUTHENTICATED POP-CULTURE VAULT</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight">
            {category.name} <span className="text-rose-500">Universe</span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {category.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
            {category.genres.map(g => (
              <span
                key={g}
                className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-slate-300 backdrop-blur-md"
              >
                #{g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs & Filter Bar (Sticky) */}
      <div className="sticky top-16 z-30 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'all', label: 'All Content' },
              { id: 'characters', label: `Characters (${characters.length})` },
              { id: 'articles', label: `Articles (${articles.length})` },
              { id: 'media', label: `Media (${media.length})` },
              { id: 'events', label: `Events (${events.length})` },
              { id: 'merch', label: `Merchandise (${merchandise.length})` },
              { id: 'upcoming', label: `Releases (${releases.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 font-bold transition-all ${
                  activeTab === tab.id
                    ? 'border border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
            >
              <option value="latest">Sort: Latest</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="alpha">Sort: A-Z Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-14">
        {/* Characters Section */}
        {(activeTab === 'all' || activeTab === 'characters') && characters.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-rose-400" />
                  <span>Iconic {category.name} Characters</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Official canonical rosters and combat ratings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map(char => (
                <div
                  key={char.id}
                  onClick={() =>
                    onSelectContent({
                      id: char.id,
                      title: char.name,
                      slug: char.id,
                      category: char.category,
                      fandom: char.fandom,
                      type: 'character',
                      description: char.shortBio,
                      image: char.avatar,
                      releaseYear: 2023,
                      genre: 'Shonen',
                      rating: 5,
                      popularity: 92,
                      tags: char.abilities
                    })
                  }
                  className="group cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700 hover:shadow-xl hover:shadow-rose-950/20"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                        {char.role}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                        {char.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {char.shortBio}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {char.abilities.map(a => (
                        <span key={a} className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{char.fandom}</span>
                      <span className="text-rose-400 font-bold group-hover:underline">
                        View Bio →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Articles Section */}
        {(activeTab === 'all' || activeTab === 'articles') && articles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <span>Featured Editorial Lore</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Deep-dive critical essays and franchise timeline analyses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map(art => (
                <div
                  key={art.id}
                  onClick={() =>
                    onSelectContent({
                      id: art.id,
                      title: art.title,
                      slug: art.id,
                      category: art.category,
                      fandom: art.fandom,
                      type: 'article',
                      description: art.summary,
                      image: art.coverImage,
                      publishedAt: art.publishedAt,
                      releaseYear: 2024,
                      genre: 'Analysis',
                      rating: 5,
                      popularity: 88,
                      tags: art.tags
                    })
                  }
                  className="group cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-950/20"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 rounded-lg border border-white/10 bg-black/80 px-2.5 py-1 text-[10px] font-mono text-white">
                      {art.readTime}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                        {art.category}
                      </span>
                      <h3 className="font-display text-lg font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {art.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>By {art.author}</span>
                      <span className="text-indigo-400 font-bold group-hover:underline">Read Article →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media Section */}
        {(activeTab === 'all' || activeTab === 'media') && media.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  <Film className="h-5 w-5 text-rose-400" />
                  <span>Official Media & Soundtracks</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">4K trailers, concert streams, and original scores</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {media.map(m => (
                <div
                  key={m.id}
                  onClick={() =>
                    onSelectContent({
                      id: m.id,
                      title: m.title,
                      slug: m.id,
                      category: m.category,
                      fandom: m.fandom,
                      type: 'video',
                      description: m.description,
                      image: m.thumbnail,
                      releaseYear: 2024,
                      genre: 'OST',
                      rating: m.rating,
                      popularity: 90,
                      tags: m.tags
                    })
                  }
                  className="group cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={m.thumbnail}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono text-white">
                      {m.duration}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span className="text-rose-400 uppercase font-bold">{m.type}</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          {m.rating.toFixed(1)}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                        {m.title}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Stream Available</span>
                      <span className="text-rose-400 font-semibold group-hover:underline">Play →</span>
                    </div>
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
