import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle,
  Bell,
  Radio,
  Zap,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { UpcomingRelease } from '../types/index.ts';

export const UpcomingPage: React.FC = () => {
  const [releases, setReleases] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [now, setNow] = useState(Date.now());
  const [notified, setNotified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/upcoming')
      .then(res => res.json())
      .then(data => setReleases(data.releases || []))
      .catch(err => console.error('Failed to load upcoming releases:', err))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateCountdown = (targetIso: string) => {
    const diff = Math.max(0, new Date(targetIso).getTime() - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, isLive: diff === 0 };
  };

  const handleToggleNotify = (id: string) => {
    setNotified(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredReleases = releases.filter(
    r => filterType === 'all' || r.type.toLowerCase() === filterType.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* 1. Cinematic Header Banner */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[320px] w-[650px] rounded-full bg-rose-600/10 blur-[130px]" />
        
        {/* Black Grid Lines */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1 text-xs font-semibold text-rose-300 backdrop-blur-md mb-4 shadow-lg shadow-rose-950/40">
            <Clock className="h-3.5 w-3.5 text-rose-400" />
            <span className="tracking-wide">GLOBAL ENTERTAINMENT RADAR · REAL-TIME COUNTDOWN TELEMETRY</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Upcoming Releases & Drops
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time second-by-second countdown telemetry for upcoming video games, anime season premieres, blockbuster theatrical windows, and merchandise drops.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* 2. Filter Bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'gaming', 'anime', 'movies', 'tv shows', 'comics', 'manga'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-mono font-bold capitalize transition-all ${
                  filterType === t
                    ? 'border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Release Drops' : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Telemetry Synchronized (UTC 24/7)</span>
          </div>
        </div>

        {/* 3. Countdown Mission Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-500 font-mono">
            Calculating release intervals...
          </div>
        ) : filteredReleases.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredReleases.map(rel => {
              const { days, hours, minutes, seconds, isLive } = calculateCountdown(rel.releaseDate);
              const isReminded = notified[rel.id];

              return (
                <div
                  key={rel.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl transition-all duration-300 hover:border-slate-700 hover:shadow-rose-950/20 flex flex-col justify-between"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-start gap-4">
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-md">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-rose-400 uppercase">
                            {rel.type} // {rel.fandom}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                            <Flame className="h-3 w-3" />
                            {rel.hypeScore}% Hype
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-bold text-white leading-tight mt-1 group-hover:text-rose-400 transition-colors">
                          {rel.title}
                        </h3>

                        <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                          {rel.synopsis}
                        </p>
                      </div>
                    </div>

                    {/* Mission Countdown Digital Clock */}
                    <div className="mt-6 rounded-2xl border border-slate-800/90 bg-slate-950/90 p-4 shadow-inner">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                        <span>COUNTDOWN TO WORLDWIDE LAUNCH</span>
                        <span className="text-white font-bold">{new Date(rel.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 py-2.5">
                          <span className="font-mono text-2xl font-black text-white block">
                            {days}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                            Days
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 py-2.5">
                          <span className="font-mono text-2xl font-black text-rose-400 block">
                            {hours.toString().padStart(2, '0')}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                            Hours
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 py-2.5">
                          <span className="font-mono text-2xl font-black text-indigo-400 block">
                            {minutes.toString().padStart(2, '0')}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                            Mins
                          </span>
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-slate-900/90 py-2.5">
                          <span className="font-mono text-2xl font-black text-emerald-400 block">
                            {seconds.toString().padStart(2, '0')}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                            Secs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs font-mono">
                    <span className="text-slate-400">
                      Domain: <strong className="text-slate-200">{rel.fandom} ({rel.category})</strong>
                    </span>

                    <button
                      onClick={() => handleToggleNotify(rel.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold transition-all ${
                        isReminded
                          ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Bell className="h-3.5 w-3.5" />
                      <span>{isReminded ? 'Notification Armed' : 'Set Release Reminder'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-400 font-mono">
            No upcoming releases found matching your category.
          </div>
        )}
      </div>
    </div>
  );
};
