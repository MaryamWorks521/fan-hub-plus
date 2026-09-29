import React, { useState } from 'react';
import { User, Sparkles, Check, AlertCircle, Bookmark, Bell, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { bookmarks } = useBookmarks();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [favoriteFandoms, setFavoriteFandoms] = useState<string[]>(user?.favoriteFandoms || ['Anime', 'Gaming']);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const fandomChoices = [
    'Anime',
    'Gaming',
    'Movies',
    'TV Shows',
    'K-Pop',
    'Comics',
    'Manga',
    'Cosplay',
    'Jujutsu Kaisen',
    'Elden Ring',
    'Spider-Man',
    'Dune'
  ];

  const presetAvatars = [
    '/src/assets/images/fandom_anime_cyber_1790294513680.jpg',
    '/src/assets/images/fandom_gaming_rpg_1790294531423.jpg',
    '/src/assets/images/fandom_cosplay_stage_1790294545689.jpg',
    '/src/assets/images/fandom_kpop_concert_1790294562619.jpg',
    '/src/assets/images/hero_fandom_universe_1790294495415.jpg'
  ];

  const toggleFandom = (f: string) => {
    setFavoriteFandoms(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    const res = await updateProfile({
      name,
      avatar,
      favoriteFandoms
    });

    setSaving(false);
    if (res.success) {
      setMsg('Profile preferences updated successfully.');
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          User Profile & Preferences
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your fandom credentials, avatar, favorite universes, and display settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Column: Summary Card */}
        <div className="md:col-span-4">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center">
            <img
              src={avatar || user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="mx-auto h-24 w-24 rounded-2xl object-cover border-2 border-rose-500/50 shadow-xl"
            />
            <h3 className="font-display text-lg font-bold text-white mt-4">{user.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>

            <div className="mt-2 inline-flex items-center gap-1 rounded bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 uppercase">
              Role: {user.role}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-slate-950 p-2.5">
                <span className="font-display text-lg font-bold text-white tabular-nums">
                  {bookmarks.length}
                </span>
                <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Bookmarks</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5">
                <span className="font-display text-lg font-bold text-white tabular-nums">
                  {user.favoriteFandoms?.length || 0}
                </span>
                <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Fandoms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <h3 className="font-display text-lg font-bold text-white mb-4">
              Edit Account Information
            </h3>

            {msg && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                <Check className="h-4 w-4 shrink-0" />
                <span>{msg}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Preset Fandom Avatar
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {presetAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-transform hover:scale-105 ${
                        avatar === av ? 'border-rose-500 scale-105' : 'border-slate-800'
                      }`}
                    >
                      <img src={av} alt="Avatar option" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Favorite Fandoms & Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {fandomChoices.map(f => {
                    const active = favoriteFandoms.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFandom(f)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? 'bg-rose-500 text-white font-semibold'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display & Accessibility Preferences */}
              <div className="border-t border-slate-800 pt-5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Display & Accessibility
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Theme Mode</span>
                      <span className="text-[10px] text-slate-400">Currently: {theme}</span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs text-rose-400 font-semibold"
                    >
                      Toggle
                    </button>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Font Scale</span>
                      <span className="text-[10px] text-slate-400">Size: {fontSize}</span>
                    </div>
                    <div className="flex gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setFontSize('compact')}
                        className={`px-2 py-0.5 rounded ${fontSize === 'compact' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                      >
                        A-
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSize('normal')}
                        className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontSize('large')}
                        className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
