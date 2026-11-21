import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';

/* ── Countdown target: 22 Nov 2026, midnight local time ── */
const TARGET_DATE = new Date('2026-11-22T00:00:00');

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:  Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins:  Math.floor((diff % 3_600_000)  / 60_000),
    secs:  Math.floor((diff % 60_000)     / 1_000),
  };
}

/* ── Luxury Frosted Jewel Countdown Unit ── */
function CountdownUnit({ value, label, index }) {
  return (
    <motion.div
      className="relative flex-1 min-w-0 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.08, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Outer ambient glow pod */}
      <div
        className="relative overflow-hidden rounded-2xl md:rounded-3xl p-3 sm:p-4 text-center
                   backdrop-blur-xl
                   bg-gradient-to-b from-white/[0.16] via-white/[0.06] to-white/[0.02]
                   border border-blush/35
                   shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(255,126,182,0.14)]
                   transition-all duration-300 group-hover:border-gold/60 group-hover:shadow-[0_12px_36px_rgba(245,208,137,0.25)]"
      >
        {/* Subtle top specular sheen */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
          }}
        />

        {/* Shimmering Gold Digit */}
        <motion.div
          key={value}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold leading-none text-gold tracking-tight"
          style={{
            textShadow: '0 0 16px rgba(245, 208, 137, 0.65), 0 2px 4px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0.4, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {String(value).padStart(2, '0')}
        </motion.div>

        {/* Delicate tracked label */}
        <div className="font-sans text-[9px] sm:text-[10px] md:text-xs text-blush/80 font-medium uppercase tracking-[0.22em] mt-1.5 flex items-center justify-center gap-1">
          <span>{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Hero — Romantic Luxury Landing Presentation
   ═══════════════════════════════════════════ */
export default function Hero() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight * 0.95,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 py-12 md:py-20 text-center select-none overflow-hidden"
      aria-label="Birthday celebration hero"
    >
      {/* ── Crisp & Vibrant Mobile Background Photo (1.jpeg) ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src="/photos/1.jpeg"
          alt="Landing backdrop"
          className="w-full h-full object-cover object-top sm:object-center filter brightness-[0.88] contrast-[1.05] saturate-[1.08] opacity-90 md:opacity-50 transition-opacity duration-500"
        />
        {/* Delicate translucent vignette — keeps photo clear while making gold text pop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(26, 11, 31, 0.45) 0%, rgba(26, 11, 31, 0.18) 28%, rgba(26, 11, 31, 0.35) 65%, rgba(26, 11, 31, 0.88) 92%, #1a0b1f 100%)',
          }}
        />
        {/* Soft rose starlight highlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(255, 126, 182, 0.18) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* ── Central Romantic Radial Aurora (behind titles) ── */}
      <div
        className="absolute w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 126, 182, 0.25) 0%, rgba(245, 208, 137, 0.12) 40%, transparent 75%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-5 sm:gap-6 w-full">
        {/* ── Floating Top Pill Badge ── */}
        <Reveal>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       backdrop-blur-md bg-white/[0.08] border border-blush/30
                       shadow-[0_4px_20px_rgba(255,126,182,0.15)]"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-gold text-xs">✦</span>
            <span className="font-sans text-[11px] sm:text-xs text-blush tracking-[0.25em] uppercase font-semibold">
              A Special Day for You
            </span>
            <span className="text-gold text-xs">✦</span>
          </motion.div>
        </Reveal>

        {/* ── Main Shimmer Title "Happy Birthday" ── */}
        <Reveal delay={0.12}>
          <div className="relative">
            {/* Subtle soft backdrop glow for crisp readability */}
            <h1
              className="shimmer-gold font-serif leading-[1.08] text-5xl sm:text-7xl md:text-8xl tracking-tight"
              style={{
                filter: 'drop-shadow(0 0 35px rgba(245, 208, 137, 0.45)) drop-shadow(0 4px 14px rgba(0, 0, 0, 0.7))',
              }}
            >
              Happy Birthday
            </h1>
          </div>
        </Reveal>

        {/* ── Calligraphy Subtitle "My favourite person" with ornamental flourishes ── */}
        <Reveal delay={0.22}>
          <div className="flex items-center justify-center gap-3 w-full">
            <span className="hidden sm:inline-block w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-rose/50 to-rose" />
            <span className="text-gold/70 text-xs sm:text-sm">✧</span>
            <p
              className="font-script text-4xl sm:text-5xl md:text-6xl text-rose"
              style={{
                textShadow:
                  '0 0 20px rgba(255, 126, 182, 0.7), 0 0 40px rgba(255, 126, 182, 0.35)',
              }}
            >
              My favourite person
            </p>
            <span className="text-gold/70 text-xs sm:text-sm">✧</span>
            <span className="hidden sm:inline-block w-8 sm:w-12 h-px bg-gradient-to-l from-transparent via-rose/50 to-rose" />
          </div>
        </Reveal>

        {/* ── Countdown Cards Pod ── */}
        <Reveal delay={0.32} className="w-full max-w-[340px] sm:max-w-md mt-2 sm:mt-4">
          {timeLeft ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gold/60 text-[10px]">⋆</span>
                <p className="font-sans text-[11px] sm:text-xs text-blush/75 uppercase tracking-[0.25em] font-medium">
                  Counting down to your day
                </p>
                <span className="text-gold/60 text-[10px]">⋆</span>
              </div>

              {/* 4 Glass Cards */}
              <div className="flex gap-2 sm:gap-3 w-full">
                <CountdownUnit value={timeLeft.days}  label="days"  index={0} />
                <CountdownUnit value={timeLeft.hours} label="hours" index={1} />
                <CountdownUnit value={timeLeft.mins}  label="min"   index={2} />
                <CountdownUnit value={timeLeft.secs}  label="sec"   index={3} />
              </div>
            </div>
          ) : (
            <motion.div
              className="p-6 rounded-3xl backdrop-blur-xl bg-white/[0.12] border border-gold/40 shadow-[0_0_40px_rgba(245,208,137,0.3)]"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p
                className="font-script text-4xl sm:text-5xl text-gold"
                style={{ textShadow: '0 0 20px rgba(245, 208, 137, 0.8)' }}
              >
                It's your day! 🎉
              </p>
            </motion.div>
          )}
        </Reveal>

        {/* ── Interactive CTA Capsule & Scroll Prompt ── */}
        <Reveal delay={0.44} className="mt-4 sm:mt-6">
          <motion.button
            onClick={scrollToNext}
            className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full
                       backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.15]
                       border border-blush/30 hover:border-rose/60
                       shadow-[0_4px_20px_rgba(255,126,182,0.18)]
                       transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-sans text-xs text-cream/90 tracking-widest uppercase font-medium">
              Explore Our Story
            </span>
            <motion.span
              className="text-rose text-sm font-bold"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </motion.button>
        </Reveal>

        {/* ── Sweet touch hint ── */}
        <p className="font-sans text-[11px] text-blush/40 tracking-widest mt-1">
          tap anywhere to shower love ♥
        </p>
      </div>
    </section>
  );
}
