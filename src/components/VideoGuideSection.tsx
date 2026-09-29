import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Compass,
  Bookmark,
  Sword,
  Film,
  Send,
  ArrowRight
} from 'lucide-react';

interface VideoGuideSectionProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch?: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

interface VideoChapter {
  id: string;
  time: number;
  title: string;
  desc: string;
  icon: any;
  targetView?: string;
}

export const VideoGuideSection: React.FC<VideoGuideSectionProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenAuth
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(140); // default approx 2m20s
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const chapters: VideoChapter[] = [
    {
      id: 'chap-1',
      time: 0,
      title: '1. Exploring 8 Multiverse Domains',
      desc: 'Browse Anime, Movies, AAA Gaming, Prestige TV, Comics, Manga, and Cosplay.',
      icon: Compass,
      targetView: 'categories'
    },
    {
      id: 'chap-2',
      time: 25,
      title: '2. 4-Way Multiverse Battle Arena',
      desc: 'Vote live for Gojo, Jinwoo, Kratos, or Paul Atreides and watch live percentages.',
      icon: Sword,
      targetView: 'home'
    },
    {
      id: 'chap-3',
      time: 55,
      title: '3. Bookmarks & Private Notes',
      desc: 'Save any character, trailer, or essay to your Dashboard with personal reading notes.',
      icon: Bookmark,
      targetView: 'dashboard'
    },
    {
      id: 'chap-4',
      time: 85,
      title: '4. 4K Cinema Trailers & Soundtracks',
      desc: 'Experience high-fidelity trailers, Ludwig Göransson suites, and release timers.',
      icon: Film,
      targetView: 'multimedia'
    },
    {
      id: 'chap-5',
      time: 115,
      title: '5. Submitting Fan Lore & Art',
      desc: 'Publish your own articles, cosplay photos, or lore theories for Administrator review.',
      icon: Send,
      targetView: 'submissions'
    }
  ];

  // Sync video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      // Determine active chapter
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (cur >= chapters[i].time) {
          setActiveChapterIndex(i);
          break;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 140);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const jumpToChapter = (timeInSeconds: number, index: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
    setActiveChapterIndex(index);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleSpeed = () => {
    if (!videoRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen?.().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-b border-white/[0.06]">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-72 bg-gradient-to-r from-rose-600/10 via-purple-600/10 to-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-300 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>NEW TO FAN HUB PLUS? · INTERACTIVE VIDEO GUIDE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
            Platform Walkthrough & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400">Quick Guide</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Naye users ke liye 2-minute video guide: seekhein website ke saare features, voting arena, 4K trailers, aur bookmarks use karna!
          </p>
        </div>

        <button
          onClick={onOpenSearch || (() => onNavigate('explore'))}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all shadow-sm"
        >
          <HelpCircle className="h-4 w-4 text-rose-400" />
          <span>Quick Search (⌘K)</span>
        </button>
      </div>

      {/* Main Video & Interactive Chapter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Cinematic Video Player (7 Cols) */}
        <div className="lg:col-span-7 overflow-hidden rounded-3xl border border-white/15 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-video w-full bg-black group">
            {/* HTML5 High Quality Video */}
            <video
              ref={videoRef}
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
              poster="/src/assets/images/cinema_dragon_throne_1790361965433.jpg"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="h-full w-full object-cover cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all cursor-pointer"
              >
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-indigo-600 text-white shadow-2xl shadow-rose-900/60 ring-4 ring-white/20 transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 translate-x-0.5 fill-white" />
                </div>
                <div className="mt-3 text-center">
                  <span className="text-sm font-black text-white tracking-wide block drop-shadow">
                    WATCH 2-MIN PLATFORM TOUR
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium drop-shadow">
                    Click to start guided video walkthrough
                  </span>
                </div>
              </div>
            )}

            {/* On-Screen Chapter Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 rounded-xl bg-slate-950/80 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md border border-white/10 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>{currentChapter.title}</span>
            </div>

            {/* Dynamic Urdu / English Subtitle Overlay */}
            {showSubtitles && (
              <div className="absolute bottom-14 left-4 right-4 pointer-events-none text-center">
                <span className="inline-block rounded-lg bg-black/80 px-3 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur-md shadow-md border border-white/10">
                  {currentChapter.desc}
                </span>
              </div>
            )}

            {/* Custom Modern Video Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 flex flex-col gap-2">
              {/* Progress Scrubber */}
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500 hover:h-2 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 text-white hover:text-rose-400 transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1 text-white hover:text-rose-400 transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
                  </button>

                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Subtitle Toggle */}
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      showSubtitles ? 'bg-rose-500 text-white' : 'bg-white/20 text-slate-300'
                    }`}
                  >
                    CC
                  </button>

                  {/* Speed Button */}
                  <button
                    onClick={toggleSpeed}
                    className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-slate-200 hover:bg-white/20 font-mono"
                  >
                    {playbackSpeed}x
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1 text-slate-300 hover:text-white"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Under-Video Quick Tips & Actions */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/[0.08] bg-slate-950/60">
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Current Interactive Topic
              </span>
              <span className="text-sm font-bold text-white">
                {currentChapter.title}
              </span>
            </div>

            {currentChapter.targetView && (
              <button
                onClick={() => onNavigate(currentChapter.targetView!)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-rose-900/30 hover:scale-105 transition-all"
              >
                <span>Try This Feature Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Chapter Jump Menu & Step Guide (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">
            Jump to Platform Feature (Click to Seek Video)
          </div>

          {chapters.map((chap, idx) => {
            const Icon = chap.icon;
            const isActive = activeChapterIndex === idx;

            return (
              <button
                key={chap.id}
                onClick={() => jumpToChapter(chap.time, idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isActive
                    ? 'border-rose-500/60 bg-gradient-to-r from-rose-950/40 via-purple-950/20 to-slate-900/60 shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/40'
                    : 'border-white/[0.08] bg-slate-900/40 hover:border-white/20 hover:bg-slate-900/70 text-slate-300'
                }`}
              >
                {/* Chapter Icon */}
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? 'bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-md shadow-rose-900/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {chap.title}
                    </span>
                    <span className="font-mono text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded ml-2 shrink-0">
                      {formatTime(chap.time)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {chap.desc}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Quick Start Tip Box */}
          <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="text-xs text-indigo-200">
                Create a free account to unlock bookmarking & submissions!
              </span>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 whitespace-nowrap underline"
            >
              Sign Up
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
