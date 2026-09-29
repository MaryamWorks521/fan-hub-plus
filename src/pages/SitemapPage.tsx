import React from 'react';
import { Compass, Sparkles, Folder, FileText, ChevronRight } from 'lucide-react';

interface SitemapPageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate, onOpenAuth }) => {
  const categories = [
    { name: 'Anime', slug: 'anime' },
    { name: 'Gaming', slug: 'gaming' },
    { name: 'Movies', slug: 'movies' },
    { name: 'TV Shows', slug: 'tv-shows' },
    { name: 'K-Pop', slug: 'k-pop' },
    { name: 'Comics', slug: 'comics' },
    { name: 'Manga', slug: 'manga' },
    { name: 'Cosplay', slug: 'cosplay' }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>SRS Architectural Architecture</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Platform Sitemap
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Complete hierarchical navigation tree of all public, personalized, and administrative portals on Fan Hub Plus.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="space-y-6 text-sm text-slate-300">
          {/* Root */}
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 font-display text-lg font-bold text-rose-400 hover:underline"
            >
              <Folder className="h-5 w-5" />
              <span>Home (Fandom Universe Portal)</span>
            </button>
          </div>

          <div className="border-l-2 border-slate-800 pl-6 ml-3 space-y-6">
            {/* Explore */}
            <div>
              <button
                onClick={() => onNavigate('explore')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Explore (Dynamic Content Explorer)</span>
              </button>
            </div>

            {/* Categories Subtree */}
            <div>
              <button
                onClick={() => onNavigate('categories')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Categories (8 Dedicated Fandom Pillars)</span>
              </button>

              <div className="border-l-2 border-slate-800 pl-6 ml-3 mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => onNavigate('category-detail', cat.slug)}
                    className="text-left text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    ├── {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Characters */}
            <div>
              <button
                onClick={() => onNavigate('characters')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Characters (Lore Profiles & Powers)</span>
              </button>
            </div>

            {/* Articles */}
            <div>
              <button
                onClick={() => onNavigate('articles')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Articles (Featured Analyses & Timelines)</span>
              </button>
            </div>

            {/* Multimedia */}
            <div>
              <button
                onClick={() => onNavigate('multimedia')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Multimedia (Trailers, Soundtracks, Audio Player)</span>
              </button>
            </div>

            {/* Events */}
            <div>
              <button
                onClick={() => onNavigate('events')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Events (Conventions, Meetups & Interactive Maps)</span>
              </button>
            </div>

            {/* Merchandise */}
            <div>
              <button
                onClick={() => onNavigate('merchandise')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Merchandise (Showcase & Discovery - Non-E-Commerce)</span>
              </button>
            </div>

            {/* Upcoming */}
            <div>
              <button
                onClick={() => onNavigate('upcoming')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Upcoming Releases (Synchronized Live Countdowns)</span>
              </button>
            </div>

            {/* Fan Submissions */}
            <div>
              <button
                onClick={() => onNavigate('submissions')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Fan Submissions (Creator Submission & Review Queue)</span>
              </button>
            </div>

            {/* Feedback */}
            <div>
              <button
                onClick={() => onNavigate('feedback')}
                className="flex items-center gap-2 font-semibold text-white hover:text-rose-400"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
                <span>Feedback Desk (Bugs, Suggestions, Queries)</span>
              </button>
            </div>

            {/* Auth Nodes */}
            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button onClick={() => onOpenAuth('login')} className="hover:text-white">
                  ├── Login Dialog
                </button>
                <button onClick={() => onOpenAuth('register')} className="hover:text-white">
                  ├── Registration & Fandom Preference Onboarding
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white">
                  ├── User Dashboard (Personalized greeting, Bookmarks, Notes, Orbit recommendations)
                </button>
              </div>
              <div>
                <button onClick={() => onNavigate('admin')} className="hover:text-white">
                  └── Admin Dashboard (Users, Categories, Approvals, Feedback, FAQ groundings, Analytics)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
