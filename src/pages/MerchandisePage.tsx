import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Bookmark,
  Sparkles,
  AlertCircle,
  Eye,
  Tag,
  ShieldCheck,
  Award,
  Layers,
  ExternalLink,
  X,
  ChevronRight
} from 'lucide-react';
import { MerchandiseItem } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface MerchandisePageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const MerchandisePage: React.FC<MerchandisePageProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [items, setItems] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MerchandiseItem | null>(null);

  useEffect(() => {
    fetch('/api/merchandise')
      .then(res => res.json())
      .then(data => setItems(data.merchandise || []))
      .catch(err => console.error('Failed to load merchandise:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter(m => {
    const matchesTag = tagFilter === 'all' || m.tags.includes(tagFilter as any);
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesTag && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* 1. Cinematic Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[320px] w-[650px] rounded-full bg-rose-600/10 blur-[130px]" />
        
        {/* Black Grid Lines */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1 text-xs font-semibold text-rose-300 backdrop-blur-md mb-4 shadow-lg shadow-rose-950/40">
            <Award className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">SRS SECTION 1.5 & 1.6 · FANDOM COLLECTIBLES & DISCOVERY VAULT</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Merchandise & Artifact Showcase
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Curated exhibition of 1/6 scale statues, official replica props, convention-exclusive apparel, and limited batch vinyl soundtracks.
          </p>

          {/* SRS Non-E-Commerce Badge (Strict Compliance with SRS Constraints 1.5) */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-mono text-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>EXHIBITION ONLY: No checkout or payment gateway (SRS 1.5 Compliance)</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* 2. Filters Bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md">
          {/* Tag Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold mr-1">Rarity Tag:</span>
            {['all', 'Limited Edition', 'Pre-Order', 'Collectible'].map(t => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-mono font-bold transition-all ${
                  tagFilter === t
                    ? 'border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Collections' : t}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"
            >
              <option value="all">All Releases</option>
              <option value="available">Retail Available</option>
              <option value="preorder">Pre-Order Open</option>
              <option value="upcoming">Upcoming Vault</option>
            </select>
          </div>
        </div>

        {/* 3. Merchandise Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-500 font-mono">
            Loading collectible exhibits...
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map(item => {
              const saved = isBookmarked(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative cursor-pointer flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 transition-all duration-300 hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-rose-950/20"
                >
                  {/* Collectible Image */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-950 p-4 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    {/* Bookmark Button */}
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
                            type: 'merchandise',
                            fandom: item.fandom,
                            category: item.category
                          });
                        }
                      }}
                      title={saved ? 'Remove Bookmark' : 'Add to Wishlist'}
                      className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition-all ${
                        saved
                          ? 'border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                          : 'border-white/15 bg-slate-950/80 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
                    </button>

                    {/* Rarity Tag Badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1 rounded-lg border border-rose-500/40 bg-black/85 px-2.5 py-1 backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-rose-400" />
                      <span className="font-mono text-[10px] font-bold text-rose-300 uppercase">
                        {item.tags[0]}
                      </span>
                    </div>

                    {/* Valuation / Price tag */}
                    <div className="absolute bottom-3 left-4">
                      <span className="font-mono text-lg font-black text-white">
                        {item.estimatedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[11px] font-mono text-rose-400 uppercase font-bold">
                      {item.fandom} · {item.category}
                    </span>

                    <h3 className="font-display text-base font-bold text-white mt-1 group-hover:text-rose-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/80 text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        {item.popularity} Popularity
                      </span>

                      <span className="inline-flex items-center gap-1 font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
                        <span>Inspect Exhibit</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-400 font-mono">
            No merchandise items found matching your filters.
          </div>
        )}
      </div>

      {/* Collectible Detailed Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 rounded-full bg-black/70 p-2.5 text-slate-300 hover:text-white backdrop-blur-md border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative h-64 sm:h-72 w-full sm:w-1/2 rounded-2xl bg-slate-900/80 p-4 flex items-center justify-center border border-slate-800">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs text-rose-400 font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>AUTHENTICATED COLLECTIBLE</span>
                  </div>

                  <h3 className="font-display text-2xl font-black text-white leading-snug">
                    {selectedItem.title}
                  </h3>

                  <p className="font-mono text-xl font-bold text-rose-400 mt-2">
                    {selectedItem.estimatedPrice}
                  </p>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="mt-4 space-y-1.5 font-mono text-xs text-slate-400 border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span>Franchise Domain:</span>
                      <span className="text-white font-bold">{selectedItem.fandom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Official Category:</span>
                      <span className="text-white font-bold">{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exhibition Views:</span>
                      <span className="text-emerald-400 font-bold">{selectedItem.popularity} Popularity Score</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!user) {
                        onOpenAuth('login');
                      } else {
                        toggleBookmark({
                          id: selectedItem.id,
                          title: selectedItem.title,
                          image: selectedItem.image,
                          type: 'merchandise',
                          fandom: selectedItem.fandom,
                          category: selectedItem.category
                        });
                      }
                    }}
                    className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Bookmark className="h-4 w-4" fill={isBookmarked(selectedItem.id) ? 'currentColor' : 'none'} />
                    <span>{isBookmarked(selectedItem.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
