import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { FanSubmission } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface SubmissionsPageProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const SubmissionsPage: React.FC<SubmissionsPageProps> = ({ onOpenAuth }) => {
  const { user, token } = useAuth();

  const [submissions, setSubmissions] = useState<FanSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('anime');
  const [fandom, setFandom] = useState('');
  const [type, setType] = useState<'article' | 'cosplay' | 'art' | 'theory'>('article');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMySubmissions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/submissions/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to load user submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySubmissions();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      onOpenAuth('login');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          fandom,
          type,
          summary,
          content,
          image: '/src/assets/images/hero_fandom_universe_1790294495415.jpg'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Your fan creation has been submitted to the Admin Approval Queue!');
        setTitle('');
        setFandom('');
        setSummary('');
        setContent('');
        fetchMySubmissions();
      } else {
        setErrorMsg(data.error || 'Submission failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved & Published
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            Rejected by Admin
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            Pending Administrator Review
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 sm:p-14 text-center shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-rose-600/20 blur-3xl" />
          
          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-xl shadow-rose-900/40">
              <FileText className="h-8 w-8" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1 text-xs font-semibold text-rose-300 backdrop-blur-xl mb-3">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              <span>FAN HUB CREATOR COMMUNITY</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
              Publish Your Fan Lore & Theories
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join thousands of creators sharing analytical essays, cosplay fabrication logs, character backstories, and multiverse theories.
            </p>

            {/* Feature Perks */}
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 backdrop-blur-md">
                <span className="text-[11px] font-bold text-rose-400 block mb-1">✍️ Editorial Byline</span>
                <span className="text-xs text-slate-400">Get your name and avatar credited on the global chronicles page.</span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 backdrop-blur-md">
                <span className="text-[11px] font-bold text-amber-400 block mb-1">⭐ Verified Review</span>
                <span className="text-xs text-slate-400">Community moderators verify and feature high-quality submissions.</span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 backdrop-blur-md">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">💬 Community Debates</span>
                <span className="text-xs text-slate-400">Receive comments, upvotes, and bookmarks from fans worldwide.</span>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('login')}
              className="mt-8 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-rose-900/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Sign In to Start Writing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Creator & Community Portal</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Fan Content Submissions
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Submit articles, theories, or craft breakdowns. All submissions enter our administrator approval workflow (Pending → Approved / Rejected).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Submission Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-white mb-4">
              Submit New Fan Creation
            </h2>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Creation Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. In-Depth Lore Breakdown of the Lands Between"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="anime">Anime</option>
                    <option value="gaming">Gaming</option>
                    <option value="movies">Movies</option>
                    <option value="tv-shows">TV Shows</option>
                    <option value="k-pop">K-Pop</option>
                    <option value="comics">Comics</option>
                    <option value="manga">Manga</option>
                    <option value="cosplay">Cosplay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fandom
                  </label>
                  <input
                    type="text"
                    required
                    value={fandom}
                    onChange={e => setFandom(e.target.value)}
                    placeholder="e.g. Elden Ring, Jujutsu Kaisen"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Creation Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'article', label: 'Article' },
                    { id: 'theory', label: 'Theory' },
                    { id: 'cosplay', label: 'Cosplay' },
                    { id: 'art', label: 'Fan Art' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                        type === t.id
                          ? 'bg-rose-500 text-white font-semibold'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brief Summary
                </label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="One or two sentences explaining your work..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Content Body (Full Draft)
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your article essay, lore analysis, or cosplay build notes here..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Submitting to Queue...' : 'Submit to Administrator Review'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* User Submission Tracker */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="font-display text-base font-bold text-white mb-4">
              Your Submissions ({submissions.length})
            </h3>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Checking status...
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map(sub => (
                  <div
                    key={sub.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        {sub.category} · {sub.type}
                      </span>
                      {getStatusBadge(sub.status)}
                    </div>

                    <h4 className="text-xs font-bold text-white">{sub.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{sub.summary}</p>

                    {sub.adminFeedback && (
                      <div className="mt-2 rounded-lg bg-slate-900 p-2 text-[11px] text-slate-300 border border-slate-800">
                        <strong className="text-rose-400">Admin Feedback:</strong> {sub.adminFeedback}
                      </div>
                    )}

                    <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-850">
                      Submitted on {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                You haven't submitted any fan content yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
