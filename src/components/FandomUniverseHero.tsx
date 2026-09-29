import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';

interface FandomUniverseHeroProps {
  onNavigate: (view: string, param?: string) => void;
}

interface GojoActionPhase {
  id: string;
  name: string;
  sublabel: string;
  image: string;
  energyColor: string;
  blastColor: string;
  ambientRed: string;
  shockwaveFrequency: number;
}

export const FandomUniverseHero: React.FC<FandomUniverseHeroProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gojo 3-Phase Action Evolution:
  // 1. Cursed Technique Reversal: RED (Fingertip ignition & crimson blast)
  // 2. Secret Art: HOLLOW PURPLE (Colliding Red & Blue into gravitational singularity)
  // 3. Domain Expansion: UNLIMITED VOID (Six Eyes cosmic void flood)
  const phases: GojoActionPhase[] = [
    {
      id: 'reversal-red',
      name: 'CURSED TECHNIQUE REVERSAL: RED (赫)',
      sublabel: 'Repulsive gravitational blast bursting with explosive crimson kinetic energy',
      image: '/src/assets/images/gojo_reversal_red_burst_1790297448613.jpg',
      energyColor: '#ef4444',
      blastColor: 'rgba(239, 68, 68, 0.9)',
      ambientRed: 'rgba(225, 29, 72, 0.45)',
      shockwaveFrequency: 1.5
    },
    {
      id: 'hollow-purple',
      name: 'HOLLOW TECHNIQUE: PURPLE (茈)',
      sublabel: 'Convergence of Infinity & Repulsion into a space-erasing matter pulverizer',
      image: '/src/assets/images/gojo_hollow_purple_blast_1790297433629.jpg',
      energyColor: '#a855f7',
      blastColor: 'rgba(168, 85, 247, 0.95)',
      ambientRed: 'rgba(225, 29, 72, 0.35)',
      shockwaveFrequency: 2.2
    },
    {
      id: 'unlimited-void',
      name: 'DOMAIN EXPANSION: UNLIMITED VOID (無量空処)',
      sublabel: 'Perception and time freeze as infinite stimuli paralyze the target',
      image: '/src/assets/images/hero_gojo_domain_unleashed_1790296831168.jpg',
      energyColor: '#38bdf8',
      blastColor: 'rgba(56, 189, 248, 0.9)',
      ambientRed: 'rgba(225, 29, 72, 0.3)',
      shockwaveFrequency: 1.0
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [energyPulse, setEnergyPulse] = useState(1);

  const currentPhase = phases[currentIdx];

  // Action Phase Auto-Sequence: Every 5.5 seconds Gojo launches next power phase
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 5500;
    const stepTime = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += stepTime;
      setProgress((elapsed / intervalTime) * 100);

      // Trigger action screen shake at power peak
      if (elapsed > 4500 && elapsed < 5200) {
        setScreenShake(true);
      } else {
        setScreenShake(false);
      }

      if (elapsed >= intervalTime) {
        setCurrentIdx(prev => (prev + 1) % phases.length);
        elapsed = 0;
        setProgress(0);
        // Blast impact pulse
        setEnergyPulse(1.4);
        setTimeout(() => setEnergyPulse(1), 400);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isPlaying, currentIdx, phases.length]);

  const handleManualSwitch = (idx: number) => {
    setCurrentIdx(idx);
    setProgress(0);
    setEnergyPulse(1.5);
    setScreenShake(true);
    setTimeout(() => {
      setEnergyPulse(1);
      setScreenShake(false);
    }, 450);
  };

  // High-Energy Particle FX Canvas: Lightning arcs, expanding shockwave rings, and red cursed embers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Shockwave expansion rings
    interface Ring {
      x: number;
      y: number;
      r: number;
      maxR: number;
      alpha: number;
      color: string;
      speed: number;
    }

    const rings: Ring[] = [];

    // Red cursed energy embers & blue lightning sparks
    const sparks = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      alpha: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.4 ? '#ef4444' : '#38bdf8'
    }));

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.45;

      // 1. Subtle Red Background Atmospheric Core ("piche red hu hlka sa")
      const bgGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        40,
        centerX,
        centerY,
        width * 0.65
      );
      bgGlow.addColorStop(0, 'rgba(225, 29, 72, 0.28)');
      bgGlow.addColorStop(0.4, 'rgba(159, 18, 57, 0.15)');
      bgGlow.addColorStop(0.8, 'rgba(0, 0, 0, 0.4)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Periodically spawn shockwave ring originating from Gojo's blast hand
      if (Math.random() < 0.08) {
        rings.push({
          x: centerX + (Math.random() - 0.5) * 60,
          y: centerY + (Math.random() - 0.5) * 60,
          r: 10,
          maxR: Math.max(width, height) * 0.65,
          alpha: 0.9,
          color: currentPhase.blastColor,
          speed: Math.random() * 8 + 6
        });
      }

      // Draw expanding energy shockwaves
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.speed;
        ring.alpha -= 0.018;

        if (ring.alpha <= 0 || ring.r >= ring.maxR) {
          rings.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color.replace('0.9', String(ring.alpha));
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 2. High-Frequency Electric Cursed Lightning Arcs across the screen
      if (Math.random() < 0.35) {
        ctx.beginPath();
        let lx = centerX + (Math.random() - 0.5) * 150;
        let ly = centerY + (Math.random() - 0.5) * 150;
        ctx.moveTo(lx, ly);

        for (let j = 0; j < 5; j++) {
          lx += (Math.random() - 0.5) * 120;
          ly += (Math.random() - 0.5) * 120;
          ctx.lineTo(lx, ly);
        }

        ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : currentPhase.energyColor;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.shadowColor = currentPhase.energyColor;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. High-Velocity Sparks & Red Embers
      sparks.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentPhase]);

  return (
    <div
      className={`relative w-full overflow-hidden border-b border-black bg-black select-none ${
        screenShake ? 'animate-[pulse_0.15s_ease-in-out_infinite]' : ''
      }`}
      style={{
        height: '84vh',
        minHeight: '620px',
        maxHeight: '940px'
      }}
    >
      {/* ========================================================================= */}
      {/* 1. GOJO IN ACTION UNLEASHING HIS TECHNIQUE (Full-Screen Visuals) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        {phases.map((phase, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={phase.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={phase.image}
                alt={phase.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-transform duration-6000 ease-out"
                style={{
                  transform: isActive ? `scale(${1.06 * energyPulse})` : 'scale(1.0)'
                }}
              />

              {/* Red atmospheric backlight blend ("piche red hu hlka sa") */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${phase.ambientRed} 0%, rgba(225, 29, 72, 0.16) 45%, rgba(0, 0, 0, 0) 80%)`
                }}
              />

              {/* Radial vignetting to keep blast focal point sharp */}
              <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-black/25 to-black/60" />
            </div>
          );
        })}
      </div>

      {/* Lightning, Shockwaves & Red Energy FX Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      {/* ========================================================================= */}
      {/* 2. THE BLACK CAGE / JAAL OVERLAY ("upper black lines jese jaal mai bnd hu screen") */}
      {/* ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {/* Vertical Heavy Black Prison Bars */}
        <div className="absolute inset-0 flex justify-between px-3 sm:px-8">
          {[...Array(13)].map((_, i) => (
            <div
              key={`v-cage-${i}`}
              className="h-full relative flex items-center justify-center"
              style={{ width: i === 0 || i === 12 ? '9px' : '4.5px' }}
            >
              {/* Pitch black bar */}
              <div className="h-full w-full bg-black shadow-[0_0_14px_rgba(0,0,0,1)]" />

              {/* Glowing crimson edge rim ("piche red hu hlka sa") */}
              <div className="absolute inset-y-0 -left-[1px] w-[1px] bg-rose-600/40" />
              <div className="absolute inset-y-0 -right-[1px] w-[1px] bg-rose-600/30" />

              {/* Laser restraint node */}
              {i % 2 === 0 && (
                <div className="absolute top-1/4 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
              )}
              {i % 2 !== 0 && (
                <div className="absolute top-3/4 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
              )}
            </div>
          ))}
        </div>

        {/* Horizontal Black Crossbars (Complete "Jaal" Grid Effect) */}
        <div className="absolute inset-0 flex flex-col justify-between py-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-strut-${i}`}
              className="w-full relative flex items-center"
              style={{ height: i === 0 || i === 7 ? '9px' : '4px' }}
            >
              <div className="w-full h-full bg-black shadow-[0_0_16px_rgba(0,0,0,1)]" />
              <div className="absolute inset-x-0 -top-[1px] h-[1px] bg-rose-600/40" />
              <div className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-rose-600/30" />
            </div>
          ))}
        </div>

        {/* Heavy Outer Steel Border */}
        <div className="absolute inset-0 border-[10px] sm:border-[16px] border-black shadow-[inset_0_0_40px_rgba(225,29,72,0.45)]" />
      </div>

      {/* ========================================================================= */}
      {/* 3. CLEAN NON-OBSTRUCTIVE ACTION INTERACTION OVERLAY (No Text in Center) */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex h-full w-full flex-col justify-between p-4 sm:p-8">
        {/* Top Action Header: Technique Name & Instant Phase Switches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-black/90 px-3.5 py-1.5 backdrop-blur-md shadow-2xl">
            <Zap className="h-4 w-4 text-rose-400 animate-pulse" />
            <span className="font-mono text-xs font-black tracking-widest text-white uppercase">
              SATORU GOJO // {currentPhase.name.split(' (')[0]}
            </span>
          </div>

          {/* Quick Phase Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {phases.map((p, idx) => {
              const active = idx === currentIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => handleManualSwitch(idx)}
                  className={`rounded-lg border px-3 py-1 text-xs font-mono font-bold transition-all ${
                    active
                      ? 'border-rose-500 bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.7)]'
                      : 'border-slate-800 bg-black/85 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px]">0{idx + 1}</span>{' '}
                  <span className="hidden sm:inline">
                    {idx === 0 ? 'RED 赫' : idx === 1 ? 'PURPLE 茈' : 'VOID 処'}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Action' : 'Resume Action'}
              className="rounded-lg border border-slate-800 bg-black/85 p-1.5 text-slate-300 hover:text-white"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Center Area is completely clear so Gojo's raw action blast dominates the screen */}
        <div className="pointer-events-none flex-1 flex items-center justify-center">
          {/* Subtle Dynamic Blast Focus Reticle (Fades in during peak power blast) */}
          <div
            className="h-28 w-28 rounded-full border border-dashed border-rose-500/30 animate-spin opacity-40 pointer-events-none"
            style={{ animationDuration: '10s' }}
          />
        </div>

        {/* Bottom Action Subtitle & Lore Controls */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
          {/* Technique Description */}
          <div className="max-w-xl rounded-2xl border border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl shadow-2xl text-left">
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {currentPhase.sublabel}
            </p>
          </div>

          {/* Controls & Progress bar */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-black/90 px-4 py-2.5 backdrop-blur-xl">
            <button
              onClick={() => handleManualSwitch((currentIdx - 1 + phases.length) % phases.length)}
              title="Previous Technique"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleManualSwitch((currentIdx + 1) % phases.length)}
              title="Next Technique"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="w-24 sm:w-36 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-75 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onNavigate('characters', 'char-1')}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md whitespace-nowrap"
            >
              Gojo Lore Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
