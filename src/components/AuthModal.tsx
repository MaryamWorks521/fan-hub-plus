import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, register } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTab(initialMode);
    setError('');
    setSuccess('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Register validation
    if (tab === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    // Login validation
    if (tab === 'login') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }

      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email.trim(), password);

        if (res.success) {
          setSuccess('Login successful! Welcome back.');

          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setError(res.error || 'Invalid email or password.');
        }
      } else {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          favoriteFandoms: ['Anime', 'Gaming', 'Movies']
        });

        if (res.success) {
          setSuccess('Account created successfully!');

          setTimeout(() => {
            onClose();
          }, 700);
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setError(
        err?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white transition-all"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-indigo-600 text-white shadow-lg shadow-rose-900/40">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="font-display text-2xl font-black text-white">
            {tab === 'login' ? 'Log In' : 'Sign Up'}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {tab === 'login'
              ? 'Enter your email and password to continue'
              : 'Create a new account to join Fan Hub Plus'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex rounded-xl bg-slate-950 p-1 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="px-6 pt-3">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-3.5">

          {/* Name */}
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />

                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />

              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-500 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 py-3 text-xs font-bold text-white shadow-lg shadow-rose-900/40 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Please wait...</span>
            ) : (
              <>
                <span>
                  {tab === 'login' ? 'Log In' : 'Create Account'}
                </span>

                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Switch */}
          <div className="text-center pt-2">
            {tab === 'login' ? (
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}

                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-rose-400 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already have an account?{' '}

                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-rose-400 font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};