'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Rocket, Sparkles, Star, Heart, Lightbulb, Zap, Shield, GraduationCap } from 'lucide-react';

const ROTATING_WORDS = [
  { text: 'bake cakes', color: '#f59e0b' },
  { text: 'build apps', color: '#3b82f6' },
  { text: 'design clothes', color: '#ec4899' },
  { text: 'start a podcast', color: '#8b5cf6' },
  { text: 'sell crafts', color: '#10b981' },
  { text: 'wash cars', color: '#06b6d4' },
  { text: 'teach coding', color: '#f97316' },
  { text: 'grow flowers', color: '#84cc16' },
];

const FLOATING_CARDS = [
  { label: '🧁 Cupcake Business', amount: '£350', progress: 70, top: '15%', left: '3%', delay: 0 },
  { label: '📱 Study App', amount: '£1,200', progress: 45, top: '60%', left: '1%', delay: 1.5 },
  { label: '🎨 Art Prints', amount: '£200', progress: 90, top: '25%', right: '2%', delay: 0.8 },
  { label: '🧹 Cleaning Service', amount: '£500', progress: 35, top: '65%', right: '3%', delay: 2 },
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  // Initial sparkles (stable so we avoid setState-in-effect)
  const [sparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>(() =>
    Array.from({ length: 20 }, () => ({
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 4,
    }))
  );

  // Typewriter effect
  const currentWord = ROTATING_WORDS[wordIndex].text;

  useEffect(() => {
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentWord) {
      // Pause at full word
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      // Defer state updates to avoid synchronous setState in effect
      const t = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      }, 0);
      return () => clearTimeout(t);
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentWord.substring(0, displayText.length - 1)
          : currentWord.substring(0, displayText.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord]);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#0a0f1e]">
      {/* ═══ ANIMATED GRADIENT MESH BACKGROUND ═══ */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-400/10 blur-[100px] hero-orb-1" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-[100px] hero-orb-2" />
        <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-br from-amber-400/15 to-pink-400/5 blur-[80px] hero-orb-3" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Sparkle particles */}
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white sparkle-particle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ═══ FLOATING PROJECT CARDS ═══ */}
      {FLOATING_CARDS.map((card, i) => (
        <div
          key={i}
          className="absolute hidden lg:block hero-floating-card"
          style={{
            top: card.top,
            left: card.left,
            right: card.right,
            animationDelay: `${card.delay}s`,
          } as React.CSSProperties}
        >
          <div className="glass-dark rounded-2xl px-5 py-4 shadow-2xl border border-white/10 hover:border-white/20 transition-colors duration-300 min-w-[180px]">
            <p className="text-white/90 font-semibold text-sm mb-2">{card.label}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-400 font-bold text-sm">{card.amount}</span>
              <span className="text-white/40 text-xs">{card.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full hero-progress-fill"
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* ═══ FLOATING ICONS ═══ */}
      <div className="absolute top-[12%] right-[18%] hero-float-icon hidden md:block" style={{ animationDelay: '0s' }}>
        <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-3 shadow-lg shadow-emerald-500/10">
          <Rocket className="h-6 w-6 text-emerald-400" />
        </div>
      </div>
      <div className="absolute bottom-[25%] left-[8%] hero-float-icon hidden md:block" style={{ animationDelay: '1s' }}>
        <div className="bg-amber-500/20 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-3 shadow-lg shadow-amber-500/10">
          <Lightbulb className="h-6 w-6 text-amber-400" />
        </div>
      </div>
      <div className="absolute top-[45%] left-[5%] hero-float-icon hidden lg:block" style={{ animationDelay: '2s' }}>
        <div className="bg-pink-500/20 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-3 shadow-lg shadow-pink-500/10">
          <Heart className="h-5 w-5 text-pink-400" />
        </div>
      </div>
      <div className="absolute top-[8%] left-[25%] hero-float-icon hidden lg:block" style={{ animationDelay: '0.5s' }}>
        <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-3 shadow-lg shadow-blue-500/10">
          <Star className="h-5 w-5 text-blue-400" />
        </div>
      </div>
      <div className="absolute bottom-[15%] right-[15%] hero-float-icon hidden md:block" style={{ animationDelay: '1.5s' }}>
        <div className="bg-purple-500/20 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-3 shadow-lg shadow-purple-500/10">
          <Zap className="h-5 w-5 text-purple-400" />
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Badge */}
        <div className="hero-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md text-emerald-300 rounded-full px-6 py-3 text-base sm:text-lg font-semibold mb-10 border border-emerald-400/30 badge-glow">
            <Sparkles className="h-5 w-5 animate-pulse-soft" />
            The UK&apos;s crowdfunding platform for under-18s
          </div>
        </div>

        {/* Main headline */}
        <div className="hero-fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-8">
            <span className="text-white">I want to</span>
            <br />
            <span
              className="inline-block min-w-[200px] text-left sm:text-center"
              style={{ color: ROTATING_WORDS[wordIndex].color }}
            >
              {displayText}
              <span className="animate-blink text-white/60">|</span>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="hero-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-xl sm:text-2xl text-white/50 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Create your project, get verified by your teacher, and raise real
            money to launch your business — all before you turn 18.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-fade-in flex flex-col sm:flex-row gap-4 justify-center mb-16" style={{ animationDelay: '0.7s' }}>
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/40 hover:-translate-y-0.5"
          >
            Start Your Project
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 border border-white/15 hover:border-white/25 backdrop-blur-sm hover:-translate-y-0.5"
          >
            Browse Projects
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm">
          {[
            { icon: Shield, label: 'School verified', color: 'text-emerald-400', glow: 'hover:shadow-emerald-400/20', delay: '0.9s' },
            { icon: GraduationCap, label: 'Teacher mentored', color: 'text-blue-400', glow: 'hover:shadow-blue-400/20', delay: '1.0s' },
            { icon: Heart, label: 'Parent/Guardian approved', color: 'text-amber-400', glow: 'hover:shadow-amber-400/20', delay: '1.1s' },
            { icon: Sparkles, label: 'Free to use', color: 'text-purple-400', glow: 'hover:shadow-purple-400/20', delay: '1.2s' },
          ].map((badge) => (
            <div
              key={badge.label}
              className={`hero-fade-in flex items-center gap-2.5 text-white/70 text-lg sm:text-xl font-medium px-3 py-1.5 rounded-xl transition-all duration-300 hover:bg-white/5 hover:shadow-lg ${badge.glow} cursor-default`}
              style={{ animationDelay: badge.delay }}
            >
              <badge.icon className={`h-5 w-5 ${badge.color} shrink-0`} />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
