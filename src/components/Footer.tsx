import React from 'react';
import { Compass, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-indigo-600 p-0.5">
                <span className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950 text-[10px] font-black text-rose-400">
                  F+
                </span>
              </div>
              <span className="font-display text-lg font-bold text-white tracking-wider">
                Fan Hub<span className="text-rose-500"> Plus</span>
              </span>
            </button>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Your Universe. Your Fandom. Discover and celebrate Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.
            </p>
          </div>

          {/* Quick Exploration */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Universe Exploration
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors"
                >
                  Content Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-white transition-colors"
                >
                  Fandom Categories (8 Portals)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('characters')}
                  className="hover:text-white transition-colors"
                >
                  Character Lore Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('multimedia')}
                  className="hover:text-white transition-colors"
                >
                  Multimedia & Soundtracks
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Events */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Community & Culture
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors"
                >
                  Conventions & Meetups Calendar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('merchandise')}
                  className="hover:text-white transition-colors"
                >
                  Merchandise Showcase (Discovery)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('upcoming')}
                  className="hover:text-white transition-colors"
                >
                  Upcoming Releases & Countdowns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submissions')}
                  className="hover:text-white transition-colors"
                >
                  Submit Fan Content
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Sitemap */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform & Legal
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('sitemap')}
                  className="font-medium text-rose-400 hover:underline"
                >
                  Platform Sitemap (SRS Verified)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('feedback')}
                  className="hover:text-white transition-colors"
                >
                  Bug Report & Suggestion Desk
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-500">
                  Merchandise is for discovery & valuation only. No checkout or e-commerce processing.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Fan Hub Plus. Built for modern fandom discovery.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('sitemap')} className="hover:text-slate-300">
              Sitemap
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('feedback')} className="hover:text-slate-300">
              Feedback
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
