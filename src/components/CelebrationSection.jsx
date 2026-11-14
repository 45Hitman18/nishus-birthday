import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Reveal from './Reveal';

/* ── Candle positions + colours within the SVG viewBox ── */
const CANDLES = [
  { x: 72,  fill: '#ff7eb6' },
  { x: 97,  fill: '#f5d089' },
  { x: 128, fill: '#ffd6e0' },
  { x: 153, fill: '#ff94c2' },
];

/* ── Heart particles — generated once at module load ── */
const HEART_COUNT = 30;

function makeHearts() {
  return Array.from({ length: HEART_COUNT }, (_, i) => ({
    id:    i,
    left:  `${1 + Math.random() * 97}%`,
    size:  14 + Math.random() * 22,
    dur:   3.5 + Math.random() * 3.5,
    delay: Math.random() * 2.2,
    color: ['#ff7eb6', '#ffd6e0', '#f5d089', '#ffb3cc'][i % 4],
  }));
}

/* ══════════════════════════════════════════════
   Cake SVG
   Props: blown, prefersReduced
   ══════════════════════════════════════════════ */
function Cake({ blown, prefersReduced }) {
  return (
    <svg
      width="220"
      height="252"
      viewBox="0 0 220 252"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 10px 30px rgba(255,126,182,0.22))' }}
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="110" cy="240" rx="96" ry="9" fill="#0d050f" opacity="0.38" />

      {/* ════ BOTTOM TIER ════ */}
      <rect x="10" y="155" width="200" height="80" rx="12" fill="#3a1233" />
      {/* frosting drips */}
      <path
        d="M10,155 C22,143 32,143 44,155 C56,143 66,143 78,155
           C90,143 100,143 112,155 C124,143 134,143 146,155
           C158,143 168,143 180,155 C192,143 202,143 210,155"
        fill="#ff7eb6" opacity="0.48"
      />
      {/* dot decorations */}
      {[50, 80, 110, 140, 170].map((cx, i) => (
        <circle
          key={i} cx={cx} cy={172 + (i % 2) * 18} r="5"
          fill={i % 2 ? '#ffd6e0' : '#f5d089'} opacity="0.80"
        />
      ))}
      {/* centre heart */}
      <text x="110" y="218" textAnchor="middle"
        fill="#ff7eb6" fontSize="20" opacity="0.52">♥</text>

      {/* ════ TOP TIER ════ */}
      <rect x="38" y="98" width="144" height="62" rx="10" fill="#4d1a42" />
      {/* frosting drips */}
      <path
        d="M38,98 C50,86 60,86 72,98 C84,86 94,86 106,98
           C118,86 128,86 140,98 C152,86 162,86 174,98
           C180,90 182,98 182,98"
        fill="#ffd6e0" opacity="0.52"
      />
      {/* star accent */}
      <text x="110" y="138" textAnchor="middle"
        fill="#f5d089" fontSize="16" opacity="0.62">✦</text>

      {/* ════ CANDLES + FLAMES ════ */}
      {CANDLES.map((c, i) => (
        <g key={i}>
          {/* candle body */}
          <rect
            x={c.x - 5} y="68" width="10" height="32" rx="2.5"
            fill={c.fill} opacity="0.96"
          />
          {/* wick */}
          <line
            x1={c.x} y1="68" x2={c.x} y2="62"
            stroke="#1a0b1f" strokeWidth="1.5" strokeLinecap="round"
          />

          {/* ── Flame (exits with flicker animation) ── */}
          <AnimatePresence>
            {!blown && (
              <motion.g
                key={`fl-${i}`}
                initial={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.32, delay: i * 0.07, ease: 'easeIn' }}
                style={{ transformOrigin: `${c.x}px 62px` }}
              >
                {prefersReduced ? (
                  /* static flame for reduced-motion users */
                  <ellipse cx={c.x} cy="55" rx="5.5" ry="8" fill="#f5c842" opacity="0.9" />
                ) : (
                  <>
                    {/* outer flicker */}
                    <motion.ellipse
                      cx={c.x} cy="55" rx="5.5" ry="8"
                      fill="#f5c842"
                      animate={{
                        scaleY: [1, 1.22, 0.84, 1.15, 0.92, 1],
                        scaleX: [1, 0.87, 1.12, 0.90, 1.08, 1],
                      }}
                      transition={{
                        duration: 0.72,
                        repeat:   Infinity,
                        ease:     'easeInOut',
                        delay:    i * 0.18,
                      }}
                      style={{ transformOrigin: `${c.x}px 62px` }}
                    />
                    {/* inner core */}
                    <ellipse
                      cx={c.x} cy="58" rx="2.6" ry="4.2"
                      fill="#fff5a0" opacity="0.88"
                    />
                  </>
                )}
              </motion.g>
            )}
          </AnimatePresence>

          {/* ── Smoke wisps (appear after blow) ── */}
          <AnimatePresence>
            {blown && (
              <motion.g key={`sm-${i}`}>
                <motion.circle
                  cx={c.x} cy={60} r={2} fill="#b0a0b8"
                  initial={{ opacity: 0.55, y: 0 }}
                  animate={{ opacity: 0, y: -24 }}
                  transition={{ duration: 1.4, delay: i * 0.06, ease: 'easeOut' }}
                />
                <motion.circle
                  cx={c.x + 3} cy={58} r={1.5} fill="#c0b0c8"
                  initial={{ opacity: 0.40, y: 0 }}
                  animate={{ opacity: 0, y: -34 }}
                  transition={{ duration: 1.9, delay: 0.28 + i * 0.06, ease: 'easeOut' }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════
   CelebrationSection — the finale
   ══════════════════════════════════════════════ */
export default function CelebrationSection() {
  const [blown, setBlown]               = useState(false);
  const [heartsActive, setHeartsActive] = useState(false);
  const prefersReduced                  = useReducedMotion();
  const hearts                          = useMemo(makeHearts, []);

  /* ── Tap handler ── */
  const handleTap = useCallback(() => {
    if (blown) return;
    setBlown(true);
    setHeartsActive(true);

    if (!prefersReduced) {
      const colors = ['#ff7eb6', '#ffd6e0', '#f5d089', '#ffb3cc', '#fffbe0'];

      /* Big central burst */
      confetti({
        particleCount:  110,
        spread:         110,
        startVelocity:  38,
        origin:         { x: 0.5, y: 0.58 },
        colors,
        scalar:         1.4,
        ticks:          360,
        gravity:        0.78,
      });

      /* Side cannons for 3 s */
      const end = Date.now() + 3000;
      (function frame() {
        confetti({
          particleCount: 5, angle: 60,  spread: 62,
          origin: { x: 0, y: 0.65 }, colors, ticks: 210, scalar: 1.2,
        });
        confetti({
          particleCount: 5, angle: 120, spread: 62,
          origin: { x: 1, y: 0.65 }, colors, ticks: 210, scalar: 1.2,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }, [blown, prefersReduced]);

  return (
    <section
      className="relative py-24 px-4 text-center flex flex-col items-center justify-center gap-10 min-h-[100dvh]"
      aria-label="Birthday celebration finale"
    >
      {/* ── Heart flood — fixed overlay, floats up ── */}
      {heartsActive && (
        <div
          className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
          aria-hidden="true"
        >
          {hearts.map(h => (
            <motion.div
              key={h.id}
              className="absolute select-none leading-none"
              style={{ left: h.left, bottom: -48, fontSize: h.size, color: h.color }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: '-118vh', opacity: [0, 1, 1, 0] }}
              transition={{ duration: h.dur, delay: h.delay, ease: 'easeOut' }}
            >
              ♥
            </motion.div>
          ))}
        </div>
      )}

      {/* ── "Happy Birthday, My Love" — shimmering gold ── */}
      <Reveal>
        <h2
          className="shimmer-gold font-serif leading-[1.12]
                     text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                     max-w-xl"
        >
          Happy Birthday,
          <br />
          My Love
        </h2>
      </Reveal>

      {/* ── Tappable cake ── */}
      <Reveal delay={0.22}>
        <div className="flex flex-col items-center gap-3">
          <motion.button
            onClick={handleTap}
            disabled={blown}
            className="focus:outline-none focus-visible:ring-2
                       focus-visible:ring-rose/60 rounded-2xl"
            aria-label={
              blown ? 'Candles blown out — make a wish!' : 'Tap to blow out the candles'
            }
            whileHover={!blown ? { scale: 1.05 } : {}}
            whileTap={!blown  ? { scale: 0.93 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <Cake blown={blown} prefersReduced={!!prefersReduced} />
          </motion.button>

          {/* Prompt / wish text */}
          <AnimatePresence mode="wait">
            {!blown ? (
              <motion.p
                key="hint"
                className="font-sans text-xs text-blush/50 uppercase tracking-[0.2em]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
              >
                tap to blow the candles ✨
              </motion.p>
            ) : (
              <motion.p
                key="wish"
                className="font-serif text-xl text-gold/85 italic"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.72 }}
              >
                Make a wish! 🌟
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      {/* ── Sign-off ── */}
      <div className="flex flex-col items-center gap-4 mt-2">
        <Reveal delay={0.35}>
          <p className="font-sans text-sm text-blush/50 tracking-wide">
            Made with lots of love, just for you
          </p>
        </Reveal>

        <Reveal delay={0.48}>
          <p className="font-serif text-base text-gold/62 tracking-[0.2em]">
            22.11.2026
          </p>
        </Reveal>

        <Reveal delay={0.62}>
          <motion.p
            className="font-script text-6xl md:text-7xl text-rose"
            style={{ textShadow: '0 0 32px rgba(255,126,182,0.38)' }}
            animate={{ opacity: [0.82, 1, 0.82] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Always You
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}

