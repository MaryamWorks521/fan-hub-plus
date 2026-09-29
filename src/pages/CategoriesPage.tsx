import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Globe,
  Film,
  Gamepad2,
  Tv,
  Music,
  BookOpen,
  Palette,
  Layers,
  ChevronRight
} from 'lucide-react';
import { FandomCategory } from '../types/index.ts';

interface CategoriesPageProps {
  onSelectCategory: (slug: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<FandomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryMeta: Record<string, { icon: any; color: string; badge: string; stats: string; bannerGradient: string }> = {
    anime: {
      icon: Zap,
      color: '#f43f5e',
      badge: 'TOP TRENDING',
      stats: '42+ Series · Shonen & Dark Fantasy',
      bannerGradient: 'from-rose-500/20 to-transparent'
    },
    movies: {
      icon: Film,
      color: '#f59e0b',
      badge: 'BLOCKBUSTER',
      stats: '35+ Franchises · Dune, Nolan & MCU',
      bannerGradient: 'from-amber-500/20 to-transparent'
    },
    gaming: {
      icon: Gamepad2,
      color: '#10b981',
      badge: 'AAA TITANS',
      stats: '38+ Games · Elden Ring, GTA & God of War',
      bannerGradient: 'from-emerald-500/20 to-transparent'
    },
    comics: {
      icon: Globe,
      color: '#06b6d4',
      badge: 'MULTIVERSE',
      stats: '28+ Eras · Marvel & DC Canon',
      bannerGradient: 'from-cyan-500/20 to-transparent'
    },
    manga: {
      icon: BookOpen,
      color: '#8b5cf6',
      badge: 'SERIALIZED',
      stats: '34+ Manga · Berserk, One Piece',
      bannerGradient: 'from-purple-500/20 to-transparent'
    },
    'tv-shows': {
      icon: Tv,
      color: '#6366f1',
      badge: 'PRESTIGE',
      stats: '26+ Dramas · Serialized Universes',
      bannerGradient: 'from-indigo-500/20 to-transparent'
    },
    'k-pop': {
      icon: Music,
      color: '#ec4899',
      badge: 'STADIUM TOURS',
      stats: '18+ Groups · Live Choreography',
      bannerGradient: 'from-pink-500/20 to-transparent'
    },
    cosplay: {
      icon: Palette,
      color: '#d946ef',
      badge: 'CRAFT GUILDS',
      stats: '15+ Guilds · Prop & Armor Smithing',
      bannerGradient: 'from-fuchsia-500/20 to-transparent'
    }
  };

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
      })
      .catch(err => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* ========================================================================= */}
      {/* 1. MODERN ULTRA-SLEEK HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#0e131f] via-[#07090e] to-[#07090e] pt-16 pb-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[750px] rounded-full bg-rose-600/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-xl mb-4 shadow-lg shadow-rose-950/20">
            <Layers className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">EXPLORE FANDOM MULTIVERSE · 8 CURATED REALMS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Fandom <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Portals</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Choose a dedicated realm gateway to enter curated archives for Anime, Blockbuster Cinema, AAA Gaming, Manga, and Cosplay.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODERN REALM PORTALS GRID */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-slate-400">Loading portal gates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(cat => {
              const meta = categoryMeta[cat.slug] || {
                icon: Layers,
                color: '#f43f5e',
                badge: 'REALM',
                stats: 'Curated Vault',
                bannerGradient: 'from-rose-500/20 to-transparent'
              };
              const Icon = meta.icon;

              return (
                <div
                  key={cat.slug}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-rose-950/20"
                >
                  {/* Image Stage */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                    <img
                      src={cat.coverImage}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />

                    {/* Top Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                        {meta.badge}
                      </span>
                    </div>

                    {/* Floating Emblem */}
                    <div
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-110 shadow-lg"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderColor: meta.color,
                        color: meta.color
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Title inside image */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5">
                      <h3 className="font-display text-2xl font-black text-white group-hover:text-rose-400 transition-colors drop-shadow">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-slate-300 block font-medium">
                        {meta.stats}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Genres */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cat.genres.slice(0, 3).map(g => (
                        <span key={g} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 border border-white/[0.04]">
                          #{g}
                        </span>
                      ))}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        {cat.itemCount} Records
                      </span>
                      <span
                        className="inline-flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform"
                        style={{ color: meta.color }}
                      >
                        <span>Open Realm</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
