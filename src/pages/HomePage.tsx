import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Bookmark,
  Calendar,
  Clock,
  Film,
  Star,
  ChevronRight,
  Play,
  Radio,
  Flame,
  Zap,
  Swords,
  Award,
  Layers,
  CheckCircle,
  Eye,
  TrendingUp,
  Clapperboard
} from 'lucide-react';
import {
  FandomCategory,
  Character,
  Article,
  MediaItem,
  UpcomingRelease,
  ContentItem
} from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { FandomUniverseHero } from '../components/FandomUniverseHero.tsx';
import { MovieBoxPlayer } from '../components/MovieBoxPlayer.tsx';
import { MovieBoxModal } from '../components/MovieBoxModal.tsx';
import { getMediaForCharacter, getMediaForArticle } from '../utils/mediaLauncher.ts';

// Top Premiere Spotlights for the Homepage Cinema Stage
const HOMEPAGE_CINEMA_SPOTLIGHTS: MediaItem[] = [
  {
    id: 'med-dune-1',
    title: "Dune: Part Two - The Arrakis Sandstorm Assault (4K IMAX Cinema)",
    category: "movies",
    fandom: "Dune Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
    thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    duration: "2:46:00",
    description: "Emperor of the Known Universe & The Kwisatz Haderach. Paul Atreides rides the grand sandworms of Arrakis into an epochal confrontation.",
    rating: 5.0,
    views: 14200000,
    tags: ["Paul Atreides", "Dune 2", "IMAX 70mm", "Denis Villeneuve"],
    quality: "4K IMAX 70mm"
  },
  {
    id: 'med-batman-1',
    title: "The Batman Part II - Arkham Rogues & Gotham Gothic Noir",
    category: "movies",
    fandom: "The Batman / DC Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/mqqft2x_Aa4",
    thumbnail: "/src/assets/images/batman_dark_knight_1790299278923.jpg",
    duration: "2:15:00",
    description: "Gotham's nocturnal vigilante weaponizing fear, intellect, and physical mastery across the flooded rain-swept alleys of Gotham City.",
    rating: 4.9,
    views: 12500000,
    tags: ["The Batman", "Bruce Wayne", "DC Studios", "Matt Reeves"],
    quality: "4K HDR"
  },
  {
    id: 'med-oppenheimer-1',
    title: "Oppenheimer - Christopher Nolan 70mm IMAX Official Presentation",
    category: "movies",
    fandom: "Oppenheimer / Cinema History",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/uYPbbksJxIg",
    thumbnail: "/src/assets/images/cosmic_black_hole_1790299552183.jpg",
    duration: "3:00:00",
    description: "Director of the Manhattan Project & Theoretical Physicist. Christopher Nolan's 70mm cinematic masterpiece starring Cillian Murphy.",
    rating: 5.0,
    views: 42000000,
    tags: ["Oppenheimer", "Christopher Nolan", "Cillian Murphy", "IMAX 70mm"],
    quality: "4K IMAX 70mm"
  },
  {
    id: 'med-deadpool-1',
    title: "Deadpool & Wolverine - The Void & Multiverse Battle Reels",
    category: "movies",
    fandom: "Marvel Cinematic Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/73_1biulkYk",
    thumbnail: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    duration: "2:08:00",
    description: "Multiverse Mercenaries & Unlikely Saviors. Wade Wilson and Logan clash across the fractured timelines of the Void in Marvel's team-up event.",
    rating: 4.9,
    views: 18900000,
    tags: ["Marvel", "Deadpool", "Wolverine", "Ryan Reynolds"],
    quality: "4K Dolby Vision"
  },
  {
    id: 'med-srk-1',
    title: "Jawan - The Unstoppable Mass Action Extravaganza",
    category: "movies",
    fandom: "Shah Rukh Khan Cinema",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/MWOlnZSnXJo",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "2:49:00",
    description: "Shah Rukh Khan in a dual action role directed by Atlee. A high-octane emotional action thriller that shattered global box office records.",
    rating: 5.0,
    views: 45000000,
    tags: ["Shah Rukh Khan", "Jawan", "Bollywood Action", "Atlee"],
    quality: "4K Dolby Vision"
  },
  {
    id: 'med-gojo-1',
    title: "Jujutsu Kaisen: Gojo Satoru - Domain Expansion 'Infinite Void'",
    category: "anime",
    fandom: "Jujutsu Kaisen",
    type: "trailer",
    url: "https://www.youtube-nocookie.com/embed/O6qVieflwqs",
    thumbnail: "/src/assets/images/hero_gojo_domain_unleashed_1790296831168.jpg",
    duration: "24:00",
    description: "Witness the pinnacle of Jujutsu sorcery as Gojo Satoru unleashes Hollow Purple and Unlimited Void in MAPPA's legendary animation showcase.",
    rating: 5.0,
    views: 31000000,
    tags: ["Gojo", "Jujutsu Kaisen", "Infinite Void", "MAPPA"],
    quality: "4K 60FPS"
  }
];

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectContent: (item: ContentItem) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectContent,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { t } = useLanguage();

  const [categories, setCategories] = useState<FandomCategory[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingRelease[]>([]);

  // Cinema Spotlight on Homepage
  const [cinemaIndex, setCinemaIndex] = useState(0);

  // MovieBox Interactive Modal State for Instant Cinema Playing
  const [selectedMovieForBox, setSelectedMovieForBox] = useState<MediaItem | null>(null);

  // Live countdown clock state
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch('/api/characters').then(r => r.json()).then(d => setCharacters(d.characters || []));
    fetch('/api/articles').then(r => r.json()).then(d => setArticles(d.articles || []));
    fetch('/api/upcoming').then(r => r.json()).then(d => setUpcoming(d.releases || []));

    const ticker = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  const calculateCountdown = (targetIso: string) => {
    const diff = Math.max(0, new Date(targetIso).getTime() - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const activeCinemaMovie = HOMEPAGE_CINEMA_SPOTLIGHTS[cinemaIndex] || HOMEPAGE_CINEMA_SPOTLIGHTS[0];

  return (
    <div className="relative min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* ========================================================================= */}
      {/* 1. IMMERSIVE HERO STAGE */}
      {/* ========================================================================= */}
      <FandomUniverseHero onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* 2. UNIVERSE PORTAL TILES */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-slate-300 mb-2">
              <Compass className="h-3.5 w-3.5 text-rose-400" />
              <span>MULTIVERSE DIRECTORY</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Explore Fandom <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">Realms</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <span>All Portals</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat.slug}
              onClick={() => onNavigate('category-detail', cat.slug)}
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/40 p-3 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/40 hover:bg-slate-900/80 hover:shadow-xl cursor-pointer"
            >
              <div className="relative mb-2.5 h-20 w-full overflow-hidden rounded-xl bg-slate-950">
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                {cat.name}
              </span>
              <span className="mt-0.5 text-[10px] text-slate-400 font-mono">
                {cat.itemCount} Records
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DEDICATED MOVIEBOX CINEMA PREMIERE THEATER (Sleek, Clean, Focused) */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-2">
              <Clapperboard className="h-3.5 w-3.5 text-rose-400" />
              <span>MOVIEBOX CINEMA · PREMIERE SCREEN</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              Cinema & <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">Movie Theater</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Watch Hollywood blockbusters, Bollywood action spectacles, and anime epics in Ultra HD 4K.
            </p>
          </div>

          <button
            onClick={() => onNavigate('multimedia')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-900/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Film className="h-4 w-4" />
            <span>Open MovieBox Cinema Hub (12+ Streams)</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Unified Sleek Cinema Theater Box */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.1] bg-slate-900/50 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* The Cinema Video Screen */}
            <div className="lg:col-span-8 bg-black flex flex-col justify-center relative min-h-[350px] sm:min-h-[460px]">
              <MovieBoxPlayer media={activeCinemaMovie} autoPlay={false} />
            </div>

            {/* Sidebar Track Selector & Info */}
            <div className="lg:col-span-4 p-5 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-slate-900/30">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    <span>NOW PLAYING IN THEATER</span>
                  </span>
                  <span className="rounded bg-rose-600/30 border border-rose-500/40 px-2 py-0.5 text-[10px] text-rose-300 font-mono">
                    {activeCinemaMovie.quality}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                  {activeCinemaMovie.title}
                </h3>

                <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {activeCinemaMovie.description}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {activeCinemaMovie.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-slate-400">{activeCinemaMovie.duration}</span>
                </div>
              </div>

              {/* Quick Switcher Pills for Other Blockbusters */}
              <div className="mt-6 border-t border-white/[0.08] pt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2.5">
                  Select Premiere Stream:
                </span>
                <div className="space-y-1.5">
                  {HOMEPAGE_CINEMA_SPOTLIGHTS.map((film, idx) => (
                    <button
                      key={film.id}
                      onClick={() => setCinemaIndex(idx)}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer ${
                        cinemaIndex === idx
                          ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/30'
                          : 'hover:bg-white/[0.06] text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{film.title}</span>
                      <span className="text-[10px] opacity-75 font-mono ml-2 shrink-0">
                        {film.duration}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('multimedia')}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-rose-300 transition-all cursor-pointer"
                >
                  <span>Browse All Movies in Cinema</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PANTHEON OF ICONS (Top Canonical Characters & Dossiers) */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-2">
              <Swords className="h-3.5 w-3.5" />
              <span>LEGENDARY HEROES & COMBAT DOSSIERS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              Pantheon of <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">Legends</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Verified lore dossiers, combat techniques, and cinema crossovers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('characters')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <span>View Full Character Roster ({characters.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 4 Core Champions Grid (Paul Atreides, Bruce Wayne, Deadpool & Wolverine, Oppenheimer) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {characters.slice(0, 4).map(char => (
            <div
              key={char.id}
              onClick={() => onNavigate('characters', char.id)}
              className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/40 hover:bg-slate-900/80 hover:shadow-2xl"
            >
              {/* Portrait Stage */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <img
                  src={char.avatar}
                  alt={char.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1 backdrop-blur-md">
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wide">
                    {char.category}
                  </span>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedMovieForBox(getMediaForCharacter(char));
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/50 scale-75 group-hover:scale-100 transition-transform cursor-pointer"
                    title={`Watch ${char.name} Movie`}
                  >
                    <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                  </button>
                </div>

                {/* Name */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5">
                  <span className="text-[10px] font-semibold text-rose-400 block uppercase">
                    {char.fandom}
                  </span>
                  <h3 className="font-display text-lg font-black text-white group-hover:text-rose-400 transition-colors drop-shadow">
                    {char.name}
                  </h3>
                </div>
              </div>

              {/* Bio & Actions */}
              <div className="p-4 flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {char.shortBio}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {char.abilities.slice(0, 2).map(ab => (
                      <span
                        key={ab}
                        className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-300 border border-white/[0.05] flex items-center gap-1"
                      >
                        <Zap className="h-2.5 w-2.5 text-rose-400" />
                        <span>{ab}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedMovieForBox(getMediaForCharacter(char));
                    }}
                    className="flex items-center gap-1 font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Film className="h-3.5 w-3.5" />
                    <span>Watch Movie</span>
                  </button>
                  <span className="font-semibold text-slate-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Dossier</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CRITICAL EDITORIAL ARTICLES & ESSAYS (Dune 2, Nolan 70mm, Batman) */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-2">
              <Award className="h-3.5 w-3.5" />
              <span>CRITICAL EDITORIAL REVIEWS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              Featured <span className="text-rose-500">Chronicles</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Technical animation breakdowns, sound design essays, and franchise world-building.
            </p>
          </div>
          <button
            onClick={() => onNavigate('articles')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <span>Read All Articles ({articles.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.slice(0, 4).map(art => (
            <article
              key={art.id}
              onClick={() => onNavigate('articles', art.id)}
              className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/40 hover:bg-slate-900/60 hover:shadow-2xl"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-300 bg-black/70 px-2 py-0.5 rounded-full border border-white/10 font-mono">
                  {art.readTime}
                </span>

                {/* Play Hover Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedMovieForBox(getMediaForArticle(art));
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/60 scale-75 group-hover:scale-100 transition-transform duration-300 cursor-pointer"
                    title={`Watch ${art.title} in MovieBox`}
                  >
                    <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex flex-1 flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase">
                    {art.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-white mt-1 leading-snug group-hover:text-rose-400 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedMovieForBox(getMediaForArticle(art));
                    }}
                    className="flex items-center gap-1 font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <Film className="h-3.5 w-3.5" />
                    <span>Watch Movie</span>
                  </button>
                  <span className="font-semibold text-slate-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ANTICIPATED RELEASES RADAR (Clean, Sleek Countdown Tracker) */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-b border-white/[0.06]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 mb-2">
              <Clock className="h-3.5 w-3.5" />
              <span>UPCOMING GLOBAL DROPS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              Anticipated <span className="text-rose-500">Releases</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Live countdown to the next major releases across movies, gaming, and television.
            </p>
          </div>
          <button
            onClick={() => onNavigate('upcoming')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <span>All Drops ({upcoming.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.slice(0, 3).map(rel => {
            const { days, hours, minutes } = calculateCountdown(rel.releaseDate);

            return (
              <div
                key={rel.id}
                className="rounded-2xl border border-white/[0.08] bg-slate-900/30 p-5 backdrop-blur-2xl flex flex-col justify-between transition-all hover:border-white/20 hover:bg-slate-900/50 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="h-20 w-20 rounded-xl object-cover border border-white/[0.08] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-400 uppercase">
                          {rel.fandom}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 font-mono">
                          <Flame className="h-3.5 w-3.5" />
                          {rel.hypeScore}% Hype
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-white mt-0.5 line-clamp-1">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {rel.synopsis}
                      </p>
                    </div>
                  </div>

                  {/* Digital Clock */}
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/60 p-2.5 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="font-mono text-lg font-black text-white block">
                        {days}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">
                        Days
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-lg font-black text-rose-400 block">
                        {hours.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">
                        Hours
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-lg font-black text-indigo-400 block">
                        {minutes.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400">
                        Mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <span>Launch: {new Date(rel.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button
                    onClick={() => onNavigate('upcoming')}
                    className="font-semibold text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COMMUNITY DISCOVERY CALLOUT */}
      {/* ========================================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/30 p-8 sm:p-12 text-center shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-rose-600/20 blur-3xl" />

          <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
            Join the Global Fandom Archive
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-300">
            Submit critical fan essays, debate multiverse power-scaling tiers, and save cinematic trailers to your private vault.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('multimedia')}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-900/40 hover:bg-rose-500 cursor-pointer transition-all"
            >
              <Film className="h-4 w-4" />
              <span>Watch MovieBox Cinema</span>
            </button>
            <button
              onClick={() => onNavigate('characters')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer transition-all"
            >
              <span>Explore Character Roster</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive MovieBox Modal for Instant Movie & Video Playback */}
      <MovieBoxModal
        media={selectedMovieForBox}
        onClose={() => setSelectedMovieForBox(null)}
      />
    </div>
  );
};
