import React, { useState, useEffect } from 'react';
import {
  Film,
  Star,
  Play,
  Bookmark,
  Radio,
  Search,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Flame,
  Clapperboard
} from 'lucide-react';
import { MediaItem } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { MovieBoxPlayer } from '../components/MovieBoxPlayer.tsx';

// Guaranteed Core Cinema Roster
const CORE_CINEMA_CATALOG: MediaItem[] = [
  {
    id: 'med-dune-1',
    title: "Dune: Part Two - The Arrakis Sandstorm Assault (4K IMAX Cinema)",
    category: "movies",
    fandom: "Dune Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/Way9Dexny3w",
    thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    duration: "2:46:00",
    description: "Emperor of the Known Universe & The Kwisatz Haderach. Paul Atreides rides the grand sandworms of Arrakis into an apocalyptic confrontation against the Harkonnens.",
    rating: 5.0,
    views: 14200000,
    tags: ["Paul Atreides", "Dune 2", "IMAX 70mm", "Denis Villeneuve", "Hans Zimmer"],
    quality: "4K IMAX 70mm",
    year: 2024,
    director: "Denis Villeneuve",
    genre: "Epic Sci-Fi / Drama"
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
    tags: ["The Batman", "Bruce Wayne", "DC Studios", "Matt Reeves", "Gothic Noir"],
    quality: "4K HDR",
    year: 2026,
    director: "Matt Reeves",
    genre: "Detective Crime Noir"
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
    tags: ["Marvel", "Deadpool", "Wolverine", "Ryan Reynolds", "Hugh Jackman"],
    quality: "4K Dolby Vision",
    year: 2024,
    director: "Shawn Levy",
    genre: "Superhero Action Comedy"
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
    tags: ["Oppenheimer", "Christopher Nolan", "Cillian Murphy", "IMAX 70mm", "Oscar Winner"],
    quality: "4K IMAX 70mm",
    year: 2023,
    director: "Christopher Nolan",
    genre: "Historical Biographical Drama"
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
  },
  {
    id: 'med-spiderman-1',
    title: "Spider-Man: Across the Spider-Verse - Multiverse Chase",
    category: "movies",
    fandom: "Spider-Man Universe",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/cqGjhVJWtEg",
    thumbnail: "/src/assets/images/multiverse_avengers_clash_1790361980755.jpg",
    duration: "2:20:00",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    rating: 5.0,
    views: 24000000,
    tags: ["Spider-Man", "Miles Morales", "Marvel", "Spider-Verse"],
    quality: "4K IMAX 60FPS"
  },
  {
    id: 'med-st-1',
    title: "Stranger Things: Season 5 - The Battle for Hawkins & Upside Down",
    category: "tv-shows",
    fandom: "Stranger Things",
    type: "video",
    url: "https://www.youtube-nocookie.com/embed/sBEvEcpnG7k",
    thumbnail: "/src/assets/images/stranger_things_5_1790431095773.jpg",
    duration: "1:15:00",
    description: "The definitive final chapter of the Duffer Brothers' pop-culture phenomenon. Hawkins is torn open by the Upside Down as Eleven fights Vecna.",
    rating: 5.0,
    views: 19500000,
    tags: ["Stranger Things", "Netflix", "Eleven", "Vecna", "Final Season"],
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
    id: 'med-srk-2',
    title: "Pathaan - YRF Spy Universe Global Spectacle",
    category: "movies",
    fandom: "Shah Rukh Khan Cinema",
    type: "movie",
    url: "https://www.youtube-nocookie.com/embed/vqu4z34wENw",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "2:26:00",
    description: "An exiled RAW agent teams up with an elite operative to stop a private terror organization from launching a deadly biological weapon.",
    rating: 4.9,
    views: 38000000,
    tags: ["Shah Rukh Khan", "Pathaan", "Spy Universe", "YRF"],
    quality: "4K UHD HDR"
  },
  {
    id: 'med-srk-3',
    title: "Dunki - Heartwarming Comedy Drama Journey",
    category: "movies",
    fandom: "Shah Rukh Khan Cinema",
    type: "movie",
    url: "https://www.youtube.com/embed/ACKQDAlAfFE",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "2:41:00",
    description: "A poignant, laughter-filled and emotionally stirring tale of four friends from Punjab dreaming of reaching England.",
    rating: 4.8,
    views: 29000000,
    tags: ["Shah Rukh Khan", "Dunki", "Rajkumar Hirani", "Comedy"],
    quality: "1080p FHD"
  },
  {
    id: 'med-ind-5',
    title: "RRR - The Revolutionary Brotherhood & Oscar Winning Roar",
    category: "movies",
    fandom: "Indian Cinema",
    type: "movie",
    url: "https://www.youtube.com/embed/NgBoMJy386M",
    thumbnail: "/src/assets/images/srk_jawan_action_1790431080528.jpg",
    duration: "3:07:00",
    description: "Academy Award winner for Best Original Song 'Naatu Naatu'. A story of two legendary revolutionaries fighting against colonial rule.",
    rating: 5.0,
    views: 58000000,
    tags: ["RRR", "SS Rajamouli", "Ram Charan", "Jr NTR"],
    quality: "4K Dolby Atmos"
  },
  {
    id: 'med-ind-4',
    title: "Kalki 2898 AD - Epic Sci-Fi Dystopian Spectacle",
    category: "movies",
    fandom: "Indian Cinema",
    type: "movie",
    url: "https://www.youtube.com/embed/kQDd1AhGIHk",
    thumbnail: "/src/assets/images/dune_desert_sandworm_1790299309457.jpg",
    duration: "3:01:00",
    description: "Monumental futuristic mythology blending the Mahabharata with cyberpunk sci-fi in the year 2898 AD across the Complex.",
    rating: 4.9,
    views: 32000000,
    tags: ["Prabhas", "Amitabh Bachchan", "Sci-Fi", "Kalki"],
    quality: "4K IMAX 60FPS"
  }
];

interface MultimediaPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const MultimediaPage: React.FC<MultimediaPageProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [mediaList, setMediaList] = useState<MediaItem[]>(CORE_CINEMA_CATALOG);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem>(CORE_CINEMA_CATALOG[0]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratedSuccess, setRatedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          // Merge with core cinema to avoid missing items
          const existingIds = new Set(data.media.map((m: MediaItem) => m.id));
          const merged = [
            ...CORE_CINEMA_CATALOG.filter(c => !existingIds.has(c.id)),
            ...data.media
          ];
          setMediaList(merged);
        }
      })
      .catch(err => console.error('Failed to load media:', err));
  }, []);

  const handleRate = async (mediaId: string, ratingValue: number) => {
    setUserRating(ratingValue);
    setRatedSuccess(true);
    setTimeout(() => setRatedSuccess(false), 2500);

    try {
      const res = await fetch(`/api/media/${mediaId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingValue })
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(prev =>
          prev.map(m => (m.id === mediaId ? { ...m, rating: data.updatedRating } : m))
        );
        if (selectedMedia.id === mediaId) {
          setSelectedMedia(prev => ({ ...prev, rating: data.updatedRating }));
        }
      }
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  const filteredMedia = mediaList.filter(m => {
    const matchesCategory =
      activeCategory === 'all' ||
      m.category === activeCategory ||
      (activeCategory === 'trailer' && m.type === 'trailer');

    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fandom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* 1. Cinematic Header Banner */}
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#0e131f] via-[#07090e] to-[#07090e] pt-14 pb-12">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[340px] w-[700px] rounded-full bg-rose-600/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-md mb-4 shadow-lg shadow-rose-950/40">
            <Clapperboard className="h-4 w-4 text-rose-400" />
            <span className="tracking-wide">MOVIEBOX CINEMA · OFFICIAL STREAMING PREMIERES</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            MovieBox <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">Cinema & Films</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            Watch Paul Atreides in Dune 2, The Batman Part II, Oppenheimer 70mm, Deadpool & Wolverine, Shah Rukh Khan blockbusters, and Satoru Gojo in Ultra HD 4K.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* 2. Flagship MovieBox Cinema Theater Screen */}
        {selectedMedia && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/[0.1] bg-slate-900/50 shadow-2xl backdrop-blur-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Media Player Stage - MovieBox Cinema */}
              <div className="lg:col-span-8 bg-black flex flex-col justify-center relative min-h-[380px] sm:min-h-[480px]">
                <MovieBoxPlayer media={selectedMedia} autoPlay={true} />
              </div>

              {/* Media Metadata & Interactive Ratings */}
              <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-slate-900/30">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      <span>NOW PLAYING IN CINEMA</span>
                    </span>
                    <span className="rounded bg-rose-600/30 border border-rose-500/40 px-2 py-0.5 text-[10px] text-rose-300 font-mono">
                      {selectedMedia.quality || '4K UHD'}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                    {selectedMedia.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {selectedMedia.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-mono">
                    {selectedMedia.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Movie Actions */}
                <div className="mt-6 border-t border-white/[0.08] pt-4">
                  <button
                    onClick={() => {
                      if (!user) {
                        onOpenAuth('login');
                      } else {
                        toggleBookmark({
                          id: selectedMedia.id,
                          title: selectedMedia.title,
                          image: selectedMedia.thumbnail,
                          type: 'media',
                          fandom: selectedMedia.fandom,
                          category: selectedMedia.category
                        });
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isBookmarked(selectedMedia.id)
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                        : 'border border-white/15 bg-white/[0.05] text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" fill={isBookmarked(selectedMedia.id) ? 'currentColor' : 'none'} />
                    <span>
                      {isBookmarked(selectedMedia.id) ? 'Saved to Your Media Vault' : 'Bookmark Movie'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Search Bar - Clean & Minimal without cluttered tabs */}
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-rose-400" />
            <h3 className="font-display text-sm font-bold text-white">
              Movie Collection <span className="text-slate-400 font-normal">({filteredMedia.length} Titles)</span>
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, character, or director..."
              className="w-full rounded-xl border border-white/[0.1] bg-slate-950/80 pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Movie Catalog Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedia.map(item => {
            const isCurrent = selectedMedia?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedMedia(item);
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                }}
                className={`group cursor-pointer flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 ${
                  isCurrent
                    ? 'border-rose-500 bg-slate-900/90 shadow-2xl shadow-rose-950/40 ring-1 ring-rose-500'
                    : 'border-white/[0.08] bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/80 hover:shadow-xl'
                }`}
              >
                {/* Thumbnail Stage */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />

                  {/* Quality Badge */}
                  <div className="absolute top-2.5 right-2.5 rounded-full bg-black/70 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-rose-300 backdrop-blur-md">
                    {item.quality ? item.quality.split(' ')[0] : '4K'}
                  </div>

                  {/* Play hover badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/50 scale-75 group-hover:scale-100 transition-transform">
                      <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {item.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                      <span className="text-rose-400 uppercase tracking-wide truncate max-w-[140px]">
                        {item.fandom}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-slate-400">{item.views ? `${(item.views / 1000000).toFixed(1)}M views` : ''}</span>
                    <span className="font-bold text-rose-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Watch Now</span>
                      <Play className="h-3 w-3" fill="currentColor" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
