import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Swords,
  ChevronRight,
  Flame,
  Star,
  Activity,
  Play,
  Film
} from 'lucide-react';
import { Character, Article, MediaItem } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { MovieBoxModal } from '../components/MovieBoxModal.tsx';
import { getMediaForCharacter } from '../utils/mediaLauncher.ts';

interface CharactersPageProps {
  initialCharacterId?: string;
  onSelectArticle: (articleId: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const CharactersPage: React.FC<CharactersPageProps> = ({
  initialCharacterId,
  onSelectArticle,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [movieBoxMedia, setMovieBoxMedia] = useState<MediaItem | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetch('/api/characters')
      .then(res => res.json())
      .then(data => {
        setCharacters(data.characters || []);
        if (initialCharacterId) {
          const matched = data.characters?.find((c: Character) => c.id === initialCharacterId);
          if (matched) openCharacterModal(matched.id);
        }
      })
      .catch(err => console.error('Failed to load characters:', err))
      .finally(() => setLoading(false));
  }, [initialCharacterId]);

  const openCharacterModal = async (id: string) => {
    try {
      const res = await fetch(`/api/characters/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCharacter(data.character);
        setRelatedCharacters(data.relatedCharacters || []);
        setRelatedArticles(data.relatedArticles || []);
      }
    } catch (err) {
      console.error('Failed to fetch character detail:', err);
    }
  };

  const filteredCharacters = characters.filter(c => {
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.fandom.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* ========================================================================= */}
      {/* 1. MODERN ULTRA-SLEEK HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#0e131f] via-[#07090e] to-[#07090e] pt-16 pb-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[750px] rounded-full bg-rose-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 left-1/4 h-[250px] w-[400px] rounded-full bg-amber-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-xl mb-4 shadow-lg shadow-rose-950/20">
            <Swords className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">CANONICAL ROSTER · ANIME, CINEMA & GAMING ICONS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Character <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">Dossiers</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            From Jujutsu sorcerers and Demon Slayer hashiras to Dune oracles, Gotham vigilantes, and Elden Ring demigods. Explore verified combat mastery and backstories.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 2. MODERN SEARCH & UNIVERSE TABS */}
        {/* ========================================================================= */}
        <div className="mb-10 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 sm:p-5 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Tanjiro, Gojo, Batman, Malenia, Kratos..."
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:border-rose-500/70 focus:bg-black/90 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {[
              { id: 'all', label: 'All Universes' },
              { id: 'anime', label: 'Anime & Shonen' },
              { id: 'movies', label: 'Cinema & Films' },
              { id: 'gaming', label: 'Gaming Titans' },
              { id: 'comics', label: 'Comics' },
              { id: 'manga', label: 'Manga' }
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
        {/* 3. MODERN CHARACTER CARD GRID */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-slate-400 font-medium">Retrieving warrior archives...</p>
          </div>
        ) : filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCharacters.map(char => {
              const saved = isBookmarked(char.id);

              return (
                <div
                  key={char.id}
                  onClick={() => openCharacterModal(char.id)}
                  className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-rose-950/20"
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

                    {/* Fandom Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                        {char.category}
                      </span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (!user) {
                          onOpenAuth('login');
                        } else {
                          toggleBookmark({
                            id: char.id,
                            title: char.name,
                            image: char.avatar,
                            type: 'character',
                            fandom: char.fandom,
                            category: char.category
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

                    {/* Name inside image */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5">
                      <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-wider">
                        {char.fandom}
                      </span>
                      <h3 className="font-display text-xl font-black text-white group-hover:text-rose-400 transition-colors drop-shadow">
                        {char.name}
                      </h3>
                    </div>

                    {/* Play Movie Hover Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setMovieBoxMedia(getMediaForCharacter(char));
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/60 scale-75 group-hover:scale-100 transition-transform duration-300 cursor-pointer"
                        title={`Watch ${char.name} in MovieBox`}
                      >
                        <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {char.shortBio}
                    </p>

                    {/* Abilities Chips */}
                    <div className="mt-3 flex flex-wrap gap-1">
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

                    {/* Footer */}
                    <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setMovieBoxMedia(getMediaForCharacter(char));
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
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-400">
            No characters found matching your filters.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. EXPANDED CHARACTER DOSSIER MODAL */}
      {/* ========================================================================= */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c1017] shadow-2xl my-8">
            <button
              onClick={() => setSelectedCharacter(null)}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/70 p-2 text-slate-300 hover:text-white backdrop-blur-md border border-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Banner */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
              <img
                src={selectedCharacter.coverImage || selectedCharacter.avatar}
                alt={selectedCharacter.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-[#0c1017]/50 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-black/60 px-3 py-1 text-xs font-semibold text-rose-300 mb-1.5 backdrop-blur-md">
                  <span>{selectedCharacter.category.toUpperCase()} · {selectedCharacter.fandom}</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
                  {selectedCharacter.name}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">{selectedCharacter.role}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Full Bio */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                  Canonical Lore & Backstory
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {selectedCharacter.fullBio}
                </p>
              </div>

              {/* Combat Techniques */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  Signature Techniques & Mastery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCharacter.abilities.map(ab => (
                    <div
                      key={ab}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-xs text-slate-200"
                    >
                      <Zap className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      <span className="font-medium">{ab}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cast & Debut */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.06] py-3 text-xs">
                <div>
                  <span className="text-slate-500">First Appearance:</span>
                  <p className="font-semibold text-white mt-0.5">
                    {selectedCharacter.firstAppearance}
                  </p>
                </div>
                {selectedCharacter.voiceActor && (
                  <div>
                    <span className="text-slate-500">Official Cast / Voice:</span>
                    <p className="font-semibold text-white mt-0.5">
                      {selectedCharacter.voiceActor}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMovieBoxMedia(getMediaForCharacter(selectedCharacter))}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-currentColor" />
                    <span>Watch Movie in Cinema</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        onOpenAuth('login');
                      } else {
                        toggleBookmark({
                          id: selectedCharacter.id,
                          title: selectedCharacter.name,
                          image: selectedCharacter.avatar,
                          type: 'character',
                          fandom: selectedCharacter.fandom,
                          category: selectedCharacter.category
                        });
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>
                      {isBookmarked(selectedCharacter.id)
                        ? 'Saved'
                        : 'Bookmark'}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedCharacter(null)}
                  className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive MovieBox Cinema Modal */}
      <MovieBoxModal
        media={movieBoxMedia}
        onClose={() => setMovieBoxMedia(null)}
      />
    </div>
  );
};
