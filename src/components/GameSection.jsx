import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Reveal from './Reveal';
import GlassCard from './GlassCard';

/* ─────────────────────────────────────────────────────────────
   Wheel segments — 8 romantic surprises
   ───────────────────────────────────────────────────────────── */
const SEGMENTS = [
  { emoji: '💖', title: 'My Heart',      message: 'You hold the biggest piece of my heart, always & forever.' },
  { emoji: '🌹', title: 'My Rose',       message: 'Like a rose, you bloom more beautiful with every passing day.' },
  { emoji: '✨', title: 'My Star',       message: 'You light up every room you walk into — my brightest star.' },
  { emoji: '💌', title: 'My Letter',     message: 'Every love song ever written was secretly made for you.' },
  { emoji: '🌙', title: 'My Moon',       message: 'I love you to the moon and back — a million times over.' },
  { emoji: '🎀', title: 'My Gift',       message: 'You are the most beautiful gift life has ever given me.' },
  { emoji: '🌸', title: 'My Blossom',    message: 'With you, every ordinary moment turns into something magical.' },
  { emoji: '🍰', title: 'My Sweetness',  message: 'Sweeter than all the cakes in the world — that is you, Nishu.' },
];

const TOTAL      = SEGMENTS.length;
const SLICE_DEG  = 360 / TOTAL;

/* Alternating petal colours */
const COLOURS = [
  'rgba(255,126,182,0.82)',
  'rgba(90,22,65,0.88)',
  'rgba(245,208,137,0.78)',
  'rgba(80,18,60,0.90)',
  'rgba(255,180,210,0.80)',
  'rgba(100,25,70,0.88)',
  'rgba(255,214,224,0.75)',
  'rgba(70,15,55,0.92)',
];

/* ─────────────────────────────────────────────────────────────
   Draw the wheel on a <canvas>
   ───────────────────────────────────────────────────────────── */
function drawWheel(canvas, rotationDeg) {
  const ctx  = canvas.getContext('2d');
  const size = canvas.width;
  const cx   = size / 2;
  const cy   = size / 2;
  const r    = cx - 6;

  ctx.clearRect(0, 0, size, size);

  /* Outer glow ring */
  const glow = ctx.createRadialGradient(cx, cy, r * 0.72, cx, cy, r + 6);
  glow.addColorStop(0, 'rgba(245,208,137,0.0)');
  glow.addColorStop(1, 'rgba(245,208,137,0.55)');
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  SEGMENTS.forEach((seg, i) => {
    const startAngle = ((rotationDeg + i * SLICE_DEG - 90) * Math.PI) / 180;
    const endAngle   = startAngle + (SLICE_DEG * Math.PI) / 180;
    const midAngle   = (startAngle + endAngle) / 2;

    /* Slice */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = COLOURS[i];
    ctx.fill();

    /* Slice border */
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    /* Emoji */
    const ex = cx + (r * 0.62) * Math.cos(midAngle);
    const ey = cy + (r * 0.62) * Math.sin(midAngle);
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.font             = `${size * 0.072}px serif`;
    ctx.textAlign        = 'center';
    ctx.textBaseline     = 'middle';
    ctx.fillText(seg.emoji, 0, 0);
    ctx.restore();

    /* Label */
    const lx = cx + (r * 0.36) * Math.cos(midAngle);
    const ly = cy + (r * 0.36) * Math.sin(midAngle);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.font             = `bold ${size * 0.044}px 'Quicksand', sans-serif`;
    ctx.textAlign        = 'center';
    ctx.textBaseline     = 'middle';
    ctx.fillStyle        = 'rgba(255,255,255,0.90)';
    ctx.shadowColor      = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur       = 4;
    ctx.fillText(seg.title, 0, 0);
    ctx.restore();
  });

  /* Centre hub */
  const hub = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.13);
  hub.addColorStop(0, '#ffe9b0');
  hub.addColorStop(1, '#c47e2a');
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.13, 0, Math.PI * 2);
  ctx.fillStyle    = hub;
  ctx.shadowColor  = 'rgba(245,208,137,0.9)';
  ctx.shadowBlur   = 14;
  ctx.fill();
  ctx.shadowBlur   = 0;
  ctx.strokeStyle  = 'rgba(255,255,255,0.55)';
  ctx.lineWidth    = 2;
  ctx.stroke();

  /* Heart in centre */
  ctx.font             = `${size * 0.07}px serif`;
  ctx.textAlign        = 'center';
  ctx.textBaseline     = 'middle';
  ctx.fillStyle        = '#3a1233';
  ctx.fillText('♥', cx, cy);
}

/* ─────────────────────────────────────────────────────────────
   Easing: ease-out cubic for spin slow-down
   ───────────────────────────────────────────────────────────── */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ══════════════════════════════════════════════════════════════
   GameSection — Spin the Wheel of Love
   ══════════════════════════════════════════════════════════════ */
export default function GameSection() {
  const canvasRef      = useRef(null);
  const rafRef         = useRef(null);
  const rotRef         = useRef(0);  // actual rotation (no re-render needed mid-spin)
  const [spinning,   setSpinning]   = useState(false);
  const [result,     setResult]     = useState(null);
  const [spinCount,  setSpinCount]  = useState(0);
  const [showResult, setShowResult] = useState(false);
  const prefersReduced = useReducedMotion();

  const SIZE = 300;

  /* Initial draw */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    drawWheel(canvas, 0);
  }, []);

  /* ── Spin ── */
  const spin = () => {
    if (spinning) return;
    setShowResult(false);
    setResult(null);
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const landingDeg = Math.floor(Math.random() * 360);
    const totalDeg   = extraSpins * 360 + landingDeg;
    const duration   = prefersReduced ? 800 : 3800;

    const startRot  = rotRef.current;
    const startTime = performance.now();

    const canvas = canvasRef.current;

    function animate(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = (startRot + totalDeg * eased) % 360;

      rotRef.current = current;
      if (canvas) drawWheel(canvas, current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        /* Which segment is under the pointer (top = 0°) */
        const normalised = ((360 - current) % 360);
        const idx        = Math.floor(normalised / SLICE_DEG) % TOTAL;

        setResult(idx);
        setSpinCount(n => n + 1);
        setSpinning(false);

        setTimeout(() => {
          setShowResult(true);
          if (!prefersReduced) {
            confetti({
              particleCount: 90,
              spread: 100,
              startVelocity: 32,
              origin: { x: 0.5, y: 0.6 },
              colors: ['#ff7eb6', '#ffd6e0', '#f5d089', '#ffb3cc', '#fffbe0'],
              scalar: 1.2,
              ticks: 280,
              gravity: 0.85,
            });
          }
        }, 300);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const seg = result !== null ? SEGMENTS[result] : null;

  return (
    <section
      className="relative py-20 px-4 section-glow-rose overflow-hidden"
      aria-label="Spin the Wheel of Love"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,126,182,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* ── Heading ── */}
      <Reveal>
        <div className="section-heading mb-10">
          <h2 className="font-script text-5xl md:text-6xl shimmer-rose">Wheel of Love</h2>
          <p className="font-sans text-blush/45 text-xs tracking-[0.22em] uppercase mt-3">
            spin &amp; unlock a romantic surprise ✦
          </p>
        </div>
      </Reveal>

      {/* ── Wheel + pointer ── */}
      <Reveal delay={0.15} className="flex flex-col items-center gap-5">
        <div className="relative flex flex-col items-center">

          {/* Gold pointer arrow */}
          <motion.div
            className="relative z-20 mb-[-10px]"
            animate={spinning ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.35, repeat: spinning ? Infinity : 0 }}
          >
            <div
              style={{
                width: 0, height: 0,
                borderLeft:  '13px solid transparent',
                borderRight: '13px solid transparent',
                borderTop:   '24px solid #f5d089',
                filter: 'drop-shadow(0 0 10px rgba(245,208,137,1))',
              }}
            />
          </motion.div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="rounded-full"
            style={{
              width: SIZE,
              height: SIZE,
              boxShadow: '0 0 55px rgba(255,126,182,0.28), 0 0 25px rgba(245,208,137,0.18), 0 10px 36px rgba(0,0,0,0.55)',
            }}
          />
        </div>

        {/* ── Spin button ── */}
        <motion.button
          onClick={spin}
          disabled={spinning}
          className="relative overflow-hidden rounded-full px-10 py-3.5 font-sans font-semibold text-sm uppercase tracking-[0.22em] mt-2
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          style={{
            background: spinning
              ? 'rgba(50,15,45,0.5)'
              : 'linear-gradient(135deg, #f5d089 0%, #d4883a 50%, #f5d089 100%)',
            color: spinning ? 'rgba(245,208,137,0.4)' : '#3a1233',
            boxShadow: spinning
              ? 'inset 0 0 0 1.5px rgba(245,208,137,0.18)'
              : '0 0 28px rgba(245,208,137,0.6), 0 4px 18px rgba(0,0,0,0.45)',
          }}
          whileHover={!spinning ? { scale: 1.06 } : {}}
          whileTap={!spinning ? { scale: 0.93 } : {}}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        >
          {/* Shimmer sweep */}
          {!spinning && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)',
              }}
              animate={{ x: ['-150%', '200%'] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.0, ease: 'linear' }}
            />
          )}
          <span className="relative z-10">
            {spinning ? '✦  Spinning…' : spinCount === 0 ? '✦  Spin Now' : '✦  Spin Again'}
          </span>
        </motion.button>

        {/* Spin count */}
        {spinCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-sans text-[11px] text-blush/35 tracking-widest uppercase"
          >
            ✦ {spinCount} {spinCount === 1 ? 'spin' : 'spins'} so far ✦
          </motion.p>
        )}
      </Reveal>

      {/* ── Result card ── */}
      <AnimatePresence mode="wait">
        {showResult && seg && (
          <motion.div
            key={spinCount}
            className="mt-10 flex flex-col items-center gap-4 text-center px-4"
            initial={{ opacity: 0, y: 36, scale: 0.90 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            {/* Emoji burst */}
            <motion.div
              className="text-6xl"
              animate={{ scale: [0.6, 1.3, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              {seg.emoji}
            </motion.div>

            {/* Title */}
            <motion.p
              className="font-script text-4xl md:text-5xl text-rose"
              style={{ textShadow: '0 0 24px rgba(255,126,182,0.65)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {seg.title}
            </motion.p>

            {/* Message */}
            <GlassCard className="max-w-xs text-center">
              <p className="font-serif text-base md:text-lg text-blush/85 italic leading-relaxed">
                {seg.message}
              </p>
            </GlassCard>

            {/* Ornamental line */}
            <div className="flex items-center gap-3 mt-1 opacity-50">
              <span className="w-10 h-px bg-gradient-to-r from-transparent to-rose/60" />
              <span className="text-gold text-sm">✦</span>
              <span className="w-10 h-px bg-gradient-to-l from-transparent to-rose/60" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-time hint */}
      {spinCount === 0 && !spinning && (
        <Reveal delay={0.6}>
          <p className="text-center font-sans text-[11px] text-blush/28 tracking-widest mt-6">
            tap the button to spin ♥
          </p>
        </Reveal>
      )}
    </section>
  );
}
