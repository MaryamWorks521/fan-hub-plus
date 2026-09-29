import React, { useState } from 'react';
import {
  X,
  Globe,
  Sun,
  Moon,
  Type,
  Volume2,
  Check,
  Sparkles,
  Sliders,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../context/LanguageContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

export const SettingsModal: React.FC = () => {
  const { language, setLanguage, isSettingsOpen, closeSettings, t } = useLanguage();
  const { theme, toggleTheme, fontSize, setFontSize } = useTheme();

  const [activeTab, setActiveTab] = useState<'language' | 'display' | 'audio'>('language');

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-slate-900/95 shadow-2xl backdrop-blur-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-rose-900/30">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-white">
                {t('settings.title', 'Platform Settings')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('settings.subtitle', 'Customize your language, interface scale, audio, and visual preferences.')}
              </p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('language')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === 'language'
                ? 'border-rose-500 text-rose-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{t('settings.languageTab', 'Language & Region')}</span>
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === 'display'
                ? 'border-rose-500 text-rose-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            <span>{t('settings.displayTab', 'Display & Theme')}</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
              activeTab === 'audio'
                ? 'border-rose-500 text-rose-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{t('settings.audioTab', 'Audio & FX')}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {/* 1. Language Tab */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
                  {t('settings.selectLang', 'Select Interface Language')}
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  {t('settings.langDesc', 'All navigation, buttons, badges, and headers will instantly update in your selected language.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`relative flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/50 shadow-lg shadow-rose-950/30'
                          : 'border-white/[0.08] bg-slate-900/40 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {lang.nativeName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {lang.name} · {lang.region}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Multilingual Notice */}
              <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-indigo-200">
                  {language === 'ur' && 'اردو زبان میں دائیں سے بائیں (RTL) نیویگیشن خودکار طور پر فعال ہو جاتی ہے۔'}
                  {language === 'ko' && '한국어 전용 폰트와 헤드라인 정렬이 자동으로 최적화됩니다.'}
                  {language !== 'ur' && language !== 'ko' && 'Language preference is preserved across your browser sessions automatically.'}
                </span>
              </div>
            </div>
          )}

          {/* 2. Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  {t('settings.themeMode', 'Visual Theme')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (theme === 'light') toggleTheme();
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      theme === 'dark'
                        ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/40'
                        : 'border-white/[0.08] bg-slate-900/40 hover:border-white/20'
                    }`}
                  >
                    <Moon className="h-5 w-5 text-indigo-400" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">
                        {t('settings.themeDark', 'Dark Cosmos')}
                      </span>
                      <span className="text-[11px] text-slate-400">Cinematic Deep Space</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (theme === 'dark') toggleTheme();
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      theme === 'light'
                        ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/40'
                        : 'border-white/[0.08] bg-slate-900/40 hover:border-white/20'
                    }`}
                  >
                    <Sun className="h-5 w-5 text-amber-400" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block">
                        {t('settings.themeLight', 'Light Daylight')}
                      </span>
                      <span className="text-[11px] text-slate-400">Clean High-Contrast</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Text Size Scale */}
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  {t('settings.fontSize', 'Text Size')}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'compact', label: t('settings.sizeCompact', 'Compact (90%)'), size: '14px' },
                    { id: 'normal', label: t('settings.sizeNormal', 'Normal (100%)'), size: '16px' },
                    { id: 'large', label: t('settings.sizeLarge', 'Large (115%)'), size: '18px' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setFontSize(item.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        fontSize === item.id
                          ? 'border-rose-500 bg-rose-500/10 text-rose-300 font-bold'
                          : 'border-white/[0.08] bg-slate-900/40 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.size}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Audio & FX Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
                  Multiverse Soundscapes
                </label>
                <p className="text-xs text-slate-400">
                  Control the ambient orchestral suites, trailer audio defaults, and button feedback.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-rose-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Ambient Soundtrack Player
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Floating player at bottom right with Hans Zimmer & Ludwig Göransson suites.
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  Ready
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-slate-950/60 px-6 py-4">
          <button
            onClick={() => {
              setLanguage('en');
              setFontSize('normal');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset to English Defaults</span>
          </button>

          <button
            onClick={closeSettings}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/30 hover:scale-105 transition-all"
          >
            {t('settings.save', 'Save & Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
