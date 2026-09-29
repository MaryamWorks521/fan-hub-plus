import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bookmark,
  Sun,
  Moon,
  User as UserIcon,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  Compass,
  Sparkles,
  ChevronDown,
  Film,
  Calendar,
  ShoppingBag,
  Clock,
  BookOpen,
  Layers,
  Heart,
  Globe,
  Sliders
} from 'lucide-react';
import { useAuth, AuthContextType } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.tsx';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext.tsx';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenAuth
}) => {
 const { user, logout } = useAuth() as AuthContextType;
  const { theme, toggleTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const { language, openSettings, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement | null>(null);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary core nav links (focused, dynamic translations)
  const primaryNavLinks = [
    { label: t('nav.explore', 'Explore'), view: 'explore' },
    { label: t('nav.categories', 'Categories'), view: 'categories' },
    { label: t('nav.characters', 'Characters'), view: 'characters' },
    { label: t('nav.multimedia', 'Cinema & Media'), view: 'multimedia', icon: Film }
  ];

  // Secondary links cleanly organized in "More" dropdown
  const secondaryNavLinks = [
    { label: t('nav.articles', 'Articles & Lore'), view: 'articles', icon: BookOpen, desc: 'Deep-dive analytical essays & universe lore' },
    { label: t('nav.events', 'Events & Cons'), view: 'events', icon: Calendar, desc: 'Conventions, premieres, and schedules' },
    { label: t('nav.merchandise', 'Merchandise'), view: 'merchandise', icon: ShoppingBag, desc: 'Official statues, props & collectibles' },
    { label: t('nav.upcoming', 'Upcoming Releases'), view: 'upcoming', icon: Clock, desc: 'Countdown timers & release calendars' },
    { label: t('nav.submissions', 'Fan Submissions'), view: 'submissions', icon: Sparkles, desc: 'Community articles, theories & art' }
  ];

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const isMoreActive = secondaryNavLinks.some(link => link.view === currentView);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8">
        
        {/* Left: Brand Identity & Distinctive Emblem Logo */}
        <div className="flex items-center gap-3 lg:gap-6 xl:gap-8 shrink-0">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            aria-label="Fan Hub Plus Home"
          >
            {/* Custom High-Fidelity Cinema Emblem */}
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-500 opacity-60 blur-md group-hover:opacity-95 transition-opacity" />
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl border border-white/20 bg-slate-900/95 shadow-inner backdrop-blur-md group-hover:scale-105 transition-all duration-300">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="fhEmblemGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F43F5E" />
                      <stop offset="0.5" stopColor="#A855F7" />
                      <stop offset="1" stopColor="#38BDF8" />
                    </linearGradient>
                    <linearGradient id="fhPlusGrad" x1="16" y1="10" x2="16" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="1" stopColor="#FDA4AF" />
                    </linearGradient>
                  </defs>
                  {/* Cinematic Prism Star */}
                  <path
                    d="M16 3L19.2 12.8L29 16L19.2 19.2L16 29L12.8 19.2L3 16L12.8 12.8L16 3Z"
                    fill="url(#fhEmblemGrad)"
                  />
                  {/* Central Core */}
                  <polygon points="16,9 19.5,16 16,23 12.5,16" fill="#0B0F19" />
                  {/* Plus Symbol */}
                  <path
                    d="M16 12V20M12 16H20"
                    stroke="url(#fhPlusGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-lg lg:text-xl font-black tracking-tight text-white group-hover:text-rose-100 transition-colors">
                  FAN<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-300 to-indigo-300">HUB</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-[9px] font-black tracking-wider text-white shadow-sm shadow-rose-500/30">
                  PLUS
                </span>
              </div>
              <span className="hidden xl:block text-[8px] font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
                Pop-Culture Universe
              </span>
            </div>
          </button>

          {/* Desktop & Small Laptop Navigation (Hidden on Tablet <1024px to prevent crowding) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryNavLinks.map(link => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-white/[0.08] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* "More" Dropdown Button */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isMoreActive
                    ? 'text-rose-400 bg-rose-500/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{t('nav.more', 'More')}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900/98 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="space-y-1">
                    {secondaryNavLinks.map(link => {
                      const Icon = link.icon;
                      const isActive = currentView === link.view;
                      return (
                        <button
                          key={link.view}
                          onClick={() => {
                            onNavigate(link.view);
                            setMoreDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-all ${
                            isActive
                              ? 'bg-rose-500/15 text-rose-300'
                              : 'text-slate-200 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            isActive ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold">{link.label}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{link.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Actions & Tools (Responsive on mobile, tablet & desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
          
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400 transition-all hover:border-slate-700 hover:bg-white/[0.06] hover:text-slate-200"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t('nav.search', 'Search...')}</span>
            <kbd className="hidden xl:inline rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Language & Experience Settings Trigger */}
          <button
            onClick={openSettings}
            aria-label="Language & Settings"
            className="group flex h-8 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2 text-slate-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            title={t('nav.settings', 'Settings & Language')}
          >
            <span className="text-xs">{currentLangObj.flag}</span>
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-rose-300">
              {currentLangObj.code}
            </span>
            <Sliders className="h-3 w-3 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          {/* Bookmarks Quick Link */}
          <button
            onClick={() => {
              if (user) {
                onNavigate('dashboard', 'bookmarks');
              } else {
                onOpenAuth('login');
              }
            }}
            aria-label="Bookmarks"
            className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
          >
            <Bookmark className="h-4 w-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-all hover:bg-white/[0.08] hover:text-amber-400"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Auth / Profile */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 pr-2 transition-all hover:bg-white/[0.08]"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <span className="hidden sm:inline max-w-[80px] truncate text-xs font-semibold text-slate-200">
            {user?.name ? user.name.split(' ')[0] : ''}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900/98 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="border-b border-white/[0.08] px-3 py-2.5">
                    <p className="truncate text-xs font-bold text-white">{user.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="mt-1 inline-block rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400">
                        ADMINISTRATOR
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <Compass className="h-3.5 w-3.5 text-indigo-400" />
                      {t('nav.dashboard', 'Fan Dashboard')}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-teal-400" />
                      {t('nav.profile', 'Edit Profile')}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('submissions');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-pink-400" />
                      {t('nav.submissions', 'Fan Submissions')}
                    </button>
                    <button
                      onClick={() => {
                        openSettings();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <Sliders className="h-3.5 w-3.5 text-amber-400" />
                      {t('nav.settings', 'Settings & Language')}
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/20"
                      >
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                        {t('nav.admin', 'Admin Dashboard')}
                      </button>
                    )}
                  </div>
                  <div className="border-t border-white/[0.08] pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        onNavigate('home');
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {t('nav.signout', 'Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:text-white whitespace-nowrap"
              >
                {t('nav.login', 'Log In')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="rounded-xl bg-rose-600 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-900/30 transition-all hover:bg-rose-500 active:scale-95 whitespace-nowrap"
              >
                {t('nav.join', 'Join')}
              </button>
            </div>
          )}

          {/* Tablet & Mobile Menu Drawer Trigger (Visible below 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 lg:hidden hover:bg-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Drawer Menu for Tablet & Mobile (<1024px) */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/98 px-4 sm:px-6 pt-4 pb-6 lg:hidden backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2 px-1">
            <span>{t('hero.badge', 'Explore Universe')}</span>
            <button
              onClick={() => {
                openSettings();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
            >
              <Globe className="h-3 w-3" />
              <span>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...primaryNavLinks, ...secondaryNavLinks].map(link => {
              const Icon = link.icon || Layers;
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => {
                    onNavigate(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-left text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                      : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-rose-400" />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 px-1">
            <button
              onClick={() => {
                onNavigate('feedback');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              <span>{t('nav.feedback', 'Feedback')}</span>
            </button>

            <button
              onClick={() => {
                openSettings();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors text-amber-400"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{t('nav.settings', 'Settings')}</span>
            </button>

            <button
              onClick={() => {
                onNavigate('sitemap');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>{t('nav.sitemap', 'Sitemap')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
