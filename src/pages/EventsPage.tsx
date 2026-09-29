import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Search,
  Sparkles,
  Map,
  X,
  Bookmark,
  Compass,
  Navigation,
  Radio,
  Zap,
  Ticket
} from 'lucide-react';
import { FandomEvent } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface EventsPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [events, setEvents] = useState<FandomEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeMapEvent, setActiveMapEvent] = useState<FandomEvent | null>(null);

  // GPS Location services state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
      .catch(err => console.error('Failed to load events:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsActive(true);
        setGpsLoading(false);
      },
      () => {
        setUserCoords({ lat: 34.0522, lng: -118.2437 });
        setGpsActive(true);
        setGpsLoading(false);
      },
      { timeout: 5000 }
    );
  };

  const cities = ['all', 'Los Angeles', 'San Diego', 'Seoul', 'Tokyo', 'Nagoya'];

  let filteredEvents = events.filter(e => {
    const matchesCity = cityFilter === 'all' || e.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchesCity && matchesCat && matchesSearch;
  });

  if (gpsActive && userCoords) {
    filteredEvents = [...filteredEvents].sort((a, b) => {
      const distA = calculateDistance(userCoords.lat, userCoords.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistance(userCoords.lat, userCoords.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });
  }

  return (
    <div className="min-h-screen bg-[#07090e] pb-24 text-slate-100">
      {/* ========================================================================= */}
      {/* 1. MODERN ULTRA-SLEEK HERO BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#0e131f] via-[#07090e] to-[#07090e] pt-16 pb-14">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[380px] w-[750px] rounded-full bg-rose-600/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-300 backdrop-blur-xl mb-4 shadow-lg shadow-rose-950/20">
            <Radio className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">GLOBAL CONVENTIONS & GPS LOCATION SERVICES</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Fandom <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-indigo-400 bg-clip-text text-transparent">Events</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Discover Anime Expo, San Diego Comic-Con, Worlds Esports Finals, and Cosplay Summits with nearest-first GPS distance calculation.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 2. SEARCH & GPS RADAR CONTROLS */}
        {/* ========================================================================= */}
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 sm:p-5 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search convention name, venue..."
              className="w-full rounded-xl border border-white/[0.08] bg-black/60 px-4 py-2.5 pl-11 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
            {/* City */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-black/60 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Cities</option>
                {cities.filter(c => c !== 'all').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <CalendarIcon className="h-3.5 w-3.5 text-indigo-400" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-black/60 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Domains</option>
                <option value="anime">Anime</option>
                <option value="comics">Comics</option>
                <option value="gaming">Gaming</option>
                <option value="k-pop">K-Pop</option>
                <option value="cosplay">Cosplay</option>
              </select>
            </div>

            {/* GPS Button */}
            <button
              onClick={handleRequestGPS}
              disabled={gpsLoading}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold transition-all ${
                gpsActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <Navigation className={`h-3.5 w-3.5 ${gpsActive ? 'text-white' : 'text-emerald-400'} ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsActive ? 'GPS Nearest Active' : 'Find Nearby (GPS)'}</span>
            </button>
          </div>
        </div>

        {/* GPS Live Status */}
        {gpsActive && userCoords && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-xs text-emerald-300 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 animate-spin text-emerald-400" />
              <span>Location locked ({userCoords.lat.toFixed(2)}°, {userCoords.lng.toFixed(2)}°) · Events sorted by nearest distance</span>
            </div>
            <button
              onClick={() => {
                setGpsActive(false);
                setUserCoords(null);
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Reset GPS
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. EVENT CARDS GRID */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-4" />
            <p className="text-xs text-slate-400">Loading convention schedules...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map(ev => {
              const saved = isBookmarked(ev.id);
              const dist = gpsActive && userCoords
                ? calculateDistance(userCoords.lat, userCoords.lng, ev.coordinates.lat, ev.coordinates.lng)
                : null;

              return (
                <div
                  key={ev.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-rose-950/20"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-rose-400 uppercase tracking-wide">
                      {ev.category} · {ev.type}
                    </span>
                    <button
                      onClick={() => {
                        if (!user) {
                          onOpenAuth('login');
                        } else {
                          toggleBookmark({
                            id: ev.id,
                            title: ev.title,
                            image: ev.image,
                            type: 'event',
                            fandom: ev.category,
                            category: ev.category
                          });
                        }
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        saved
                          ? 'border-rose-500 bg-rose-600 text-white'
                          : 'border-white/10 bg-black/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                    {ev.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">
                    {ev.description}
                  </p>

                  {/* Details */}
                  <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      <span>{ev.date} · {ev.time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{ev.city} ({ev.venue})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {dist !== null && (
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            {dist} km away
                          </span>
                        )}
                        <button
                          onClick={() => setActiveMapEvent(ev)}
                          className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Map className="h-3 w-3" />
                          <span>Map</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>~{ev.attendeesCount.toLocaleString()} Estimated Fans</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <span className="text-xs font-semibold text-white">
                      {ev.price}
                    </span>
                    <a
                      href={ev.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:underline"
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      <span>Event Info</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-400">
            No events found matching your query.
          </div>
        )}
      </div>

      {/* Map Modal */}
      {activeMapEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-2xl">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c1017] p-6 shadow-2xl">
            <button
              onClick={() => setActiveMapEvent(null)}
              className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-slate-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">
                EVENT VENUE RADAR
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                {activeMapEvent.title}
              </h3>
              <p className="text-xs text-slate-400">
                {activeMapEvent.venue}, {activeMapEvent.city}
              </p>
            </div>

            <div className="relative h-60 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-black flex items-center justify-center">
              <img
                src={activeMapEvent.image}
                alt={activeMapEvent.venue}
                className="h-full w-full object-cover brightness-50"
              />
              <div className="absolute flex flex-col items-center">
                <MapPin className="h-8 w-8 text-rose-500 drop-shadow-[0_0_12px_#f43f5e]" />
                <span className="mt-2 text-xs font-semibold text-white bg-black/80 px-3 py-1 rounded-full border border-white/10 shadow">
                  {activeMapEvent.venue}
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3 text-xs">
              <button
                onClick={() => setActiveMapEvent(null)}
                className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
              <a
                href={`https://maps.google.com/?q=${activeMapEvent.coordinates.lat},${activeMapEvent.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-500 shadow-md flex items-center gap-1.5"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
