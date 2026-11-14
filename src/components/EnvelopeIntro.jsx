import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ─────────────────────────────────────────────
   EnvelopeIntro
   Full-screen sealed-envelope intro screen.
   Phases: 'sealed' → 'opening' → 'done'
   Props:
     onComplete  — called when the fade-out finishes
     audioRef    — React ref to the <audio> element
   ───────────────────────────────────────────── */
export default function EnvelopeIntro({ onComplete, audioRef }) {
  const [phase, setPhase] = useState('sealed');

  /* ── confetti heart burst ── */
  const fireHearts = useCallback(() => {
    const colors = ['#ff7eb6', '#ffd6e0', '#f5d089', '#ff94c2', '#ffb3cc'];

    // Side cannons
    const end = Date.now() + 1400;
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors,
        scalar: 1.3,
        ticks: 200,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors,
        scalar: 1.3,
        ticks: 200,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // Central burst
    confetti({
      particleCount: 80,
      spread: 90,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.55 },
      colors,
      scalar: 1.4,
      ticks: 250,
    });
  }, []);

  /* ── tap handler ── */
  const handleTap = useCallback(() => {
    if (phase !== 'sealed') return;
    setPhase('opening');

    // Start music — must be inside user-gesture handler
    if (audioRef?.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => {/* no audio file yet — that's fine */});
    }

    // Hearts burst mid-animation
    setTimeout(fireHearts, 380);

    // Fade out
    setTimeout(() => setPhase('done'), 1700);
  }, [phase, fireHearts, audioRef]);

  /* ── envelope dimensions (responsive via style vars) ── */
  const W = 288; // logical px — CSS scales it
  const H = 192;
  const halfW = W / 2;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== 'done' && (
        <motion.div
          key="envelope-intro"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center envelope-bg cursor-pointer select-none touch-manipulation"
          onClick={handleTap}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          role="button"
          tabIndex={0}
          aria-label="Tap to open your birthday message"
          onKeyDown={e => e.key === 'Enter' && handleTap()}
        >
          {/* ── Ambient rose glow pulse ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320,
              height: 320,
              background:
                'radial-gradient(circle, rgba(255,126,182,0.22) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Gold sparkles scattered around envelope ── */}
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * 360;
            const r = 160 + (i % 3) * 40;
            const x = Math.cos((angle * Math.PI) / 180) * r;
            const y = Math.sin((angle * Math.PI) / 180) * r;
            return (
              <motion.span
                key={i}
                className="absolute text-gold pointer-events-none"
                style={{ fontSize: 10 + (i % 3) * 4 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale:   [0.4, 1.2, 0.4],
                  x,
                  y,
                }}
                transition={{
                  duration: 2.2 + i * 0.25,
                  repeat:   Infinity,
                  delay:    i * 0.35,
                  ease:     'easeInOut',
                }}
              >
                ✦
              </motion.span>
            );
          })}

          {/* ══ ENVELOPE ══ */}
          <div
            className="relative"
            style={{ width: W, height: H, perspective: 700 }}
          >
            {/* ── Body (card base) ── */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(160deg, #4a1a3d 0%, #2d1028 100%)',
                border: '1.5px solid rgba(255,214,224,0.30)',
                boxShadow:
                  '0 0 48px rgba(255,126,182,0.18), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,214,224,0.08)',
              }}
            />

            {/* ── Bottom triangle fold lines ── */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={W}
              height={H}
              aria-hidden="true"
            >
              {/* left fold */}
              <line
                x1="0" y1={H}
                x2={halfW} y2={H / 2}
                stroke="rgba(255,214,224,0.12)" strokeWidth="1"
              />
              {/* right fold */}
              <line
                x1={W} y1={H}
                x2={halfW} y2={H / 2}
                stroke="rgba(255,214,224,0.12)" strokeWidth="1"
              />
            </svg>

            {/* ── Letter peeking out (animates upward when opening) ── */}
            <motion.div
              className="absolute rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                inset: '12px 16px',
                background: 'linear-gradient(150deg, #fff7f0 0%, #ffd6e0 100%)',
                zIndex: 2,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={
                phase === 'opening'
                  ? { y: -56, opacity: 1 }
                  : { y: 0,   opacity: 0 }
              }
              transition={{ delay: 0.38, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <span className="font-script text-wine text-2xl drop-shadow-sm">
                For you 🎀
              </span>
            </motion.div>

            {/* ── Static back-flap (dark triangle at top) ── */}
            <div
              className="absolute inset-x-0 top-0 overflow-hidden pointer-events-none rounded-t-2xl"
              style={{ height: H / 2, zIndex: 3 }}
            >
              <div
                style={{
                  width: 0, height: 0,
                  borderLeft:  `${halfW}px solid transparent`,
                  borderRight: `${halfW}px solid transparent`,
                  borderTop:   `${H / 2}px solid #3a1233`,
                }}
              />
            </div>

            {/* ── Animated front flap (lifts on open) ── */}
            <motion.div
              className="absolute inset-x-0 top-0 overflow-hidden pointer-events-none rounded-t-2xl"
              style={{
                height: H / 2,
                zIndex: 10,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              animate={
                phase === 'opening'
                  ? { rotateX: -168, scaleY: 1 }
                  : { rotateX: 0,    scaleY: 1 }
              }
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* flap triangle */}
              <div
                style={{
                  width: 0, height: 0,
                  borderLeft:  `${halfW}px solid transparent`,
                  borderRight: `${halfW}px solid transparent`,
                  borderTop:   `${H / 2}px solid #5c2255`,
                  filter:      'drop-shadow(0 3px 8px rgba(255,126,182,0.15))',
                }}
              />

              {/* ── Heart wax seal ── */}
              <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
                style={{
                  width:  44,
                  height: 44,
                  background: 'radial-gradient(circle at 40% 35%, #ff7eb6, #c0326a)',
                  boxShadow: '0 0 16px rgba(255,126,182,0.7), 0 2px 6px rgba(0,0,0,0.4)',
                  fontSize: 22,
                }}
                animate={
                  phase === 'opening'
                    ? { scale: 1.8, opacity: 0 }
                    : { scale: [1, 1.06, 1] }
                }
                transition={
                  phase === 'opening'
                    ? { duration: 0.28, ease: 'easeOut' }
                    : { duration: 1.9, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                ❤
              </motion.div>
            </motion.div>
          </div>
          {/* ══ END ENVELOPE ══ */}

          {/* ── Prompt text ── */}
          <motion.p
            className="mt-10 font-sans text-blush/75 text-xs md:text-sm tracking-[0.2em] uppercase text-center px-8 leading-relaxed"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Tap to open · something special for you
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

