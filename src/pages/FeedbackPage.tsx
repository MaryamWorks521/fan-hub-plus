import React, { useState } from 'react';
import { MessageSquare, Bug, Lightbulb, HelpCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const FeedbackPage: React.FC = () => {
  const { user } = useAuth();

  const [type, setType] = useState<'bug' | 'suggestion' | 'query'>('suggestion');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          userName: name || 'Anonymous Fan',
          userEmail: email || 'fan@fanhubplus.com',
          message
        })
      });

      if (res.ok) {
        setSuccess(true);
        setMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit feedback.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Fan Hub Feedback & Support Desk
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Help us improve your fandom universe experience. Submit bug reports, feature suggestions, or general platform queries.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl">
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold">Thank you for your feedback!</p>
              <p className="mt-0.5 text-emerald-400/90">
                Your report has been logged and assigned a tracking ID in our feedback administration console.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Feedback Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Feedback Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'bug', label: 'Bug Report', icon: Bug },
                { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
                { id: 'query', label: 'Platform Query', icon: HelpCircle }
              ].map(t => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3.5 text-xs font-semibold transition-all ${
                      active
                        ? 'border border-rose-500 bg-rose-500/15 text-rose-300 shadow-sm'
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. fan@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Feedback Details
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe the issue, requested feature, or query with as much detail as possible..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{submitting ? 'Transmitting Feedback...' : 'Submit Feedback to Team'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
