import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_COUNT_MOBILE = 16;
const PARTICLE_COUNT_DESKTOP = 28;

const petalColors = ['#ff7eb6', '#ffd6e0', '#f5d089', '#ff94c2', '#ffc0cb', '#fcd5ce'];
const starGlyphs = ['✦', '✧', '⋆', '·'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function ParticleBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  const halfCount = Math.floor(count / 2);

  /* ── Interactive tap hearts ── */
  const [clickHearts, setClickHearts] = useState([]);

  const handleGlobalClick = useCallback((e) => {
    // Only spawn up to 12 active click hearts to keep lightweight
    const newHearts = Array.from({ length: 4 }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x: e.clientX + (Math.random() - 0.5) * 40,
      y: e.clientY + (Math.random() - 0.5) * 30,
      size: randomBetween(14, 26),
      color: ['#ff7eb6', '#ffd6e0', '#f5d089', '#ff94c2'][Math.floor(Math.random() * 4)],
      driftX: (Math.random() - 0.5) * 60,
    }));

    setClickHearts((prev) => [...prev.slice(-10), ...newHearts]);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handleGlobalClick);
    return () => window.removeEventListener('pointerdown', handleGlobalClick);
  }, [handleGlobalClick]);

  /* ── Ambient floating hearts ── */
  const hearts = useMemo(
    () =>
      Array.from({ length: halfCount }, (_, i) => ({
        id: `h${i}`,
        left: `${randomBetween(2, 98)}%`,
        animationDuration: `${randomBetween(9, 19)}s`,
        animationDelay: `${randomBetween(0, 14)}s`,
        fontSize: `${randomBetween(12, 22)}px`,
        opacity: randomBetween(0.4, 0.75),
        color: i % 3 === 0 ? '#f5d089' : '#ff7eb6',
      })),
    [halfCount]
  );

  /* ── Floating petals ── */
  const petals = useMemo(
    () =>
      Array.from({ length: count - halfCount }, (_, i) => ({
        id: `p${i}`,
        left: `${randomBetween(2, 98)}%`,
        animationDuration: `${randomBetween(11, 24)}s`,
        animationDelay: `${randomBetween(0, 16)}s`,
        background: petalColors[i % petalColors.length],
        width: `${randomBetween(7, 15)}px`,
        height: `${randomBetween(10, 20)}px`,
        opacity: randomBetween(0.35, 0.65),
      })),
    [count, halfCount]
  );

  /* ── Twinkling starlight dust ── */
  const stars = useMemo(
    () =>
      Array.from({ length: isMobile ? 12 : 22 }, (_, i) => ({
        id: `s${i}`,
        top: `${randomBetween(5, 95)}%`,
        left: `${randomBetween(4, 96)}%`,
        glyph: starGlyphs[i % starGlyphs.length],
        size: `${randomBetween(10, 18)}px`,
        duration: randomBetween(2.5, 5),
        delay: randomBetween(0, 4),
        color: i % 2 === 0 ? '#f5d089' : '#ffd6e0',
      })),
    [isMobile]
  );

  /* ── Dreamy Bokeh Orbs ── */
  const bokehOrbs = useMemo(
    () => [
      { id: 'b1', top: '15%', left: '10%', size: 280, color: 'rgba(255, 126, 182, 0.16)' },
      { id: 'b2', top: '35%', right: '5%', size: 340, color: 'rgba(245, 208, 137, 0.14)' },
      { id: 'b3', top: '65%', left: '15%', size: 300, color: 'rgba(255, 126, 182, 0.15)' },
    ],
    []
  );

  return (
    <>
      {/* ── Soft Bokeh Aurora Blobs in background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {bokehOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full blur-[80px]"
            style={{
              top: orb.top,
              left: orb.left,
              right: orb.right,
              width: orb.size,
              height: orb.size,
              background: orb.color,
            }}
            animate={{
              scale: [1, 1.25, 1],
              x: [0, 20, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Twinkling Stars ── */}
      <div className="particle-container" aria-hidden="true">
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className="absolute select-none pointer-events-none"
            style={{
              top: s.top,
              left: s.left,
              fontSize: s.size,
              color: s.color,
              filter: `drop-shadow(0 0 6px ${s.color})`,
            }}
            animate={{
              opacity: [0.15, 0.85, 0.15],
              scale: [0.7, 1.25, 0.7],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {s.glyph}
          </motion.span>
        ))}

        {/* ── Drifting hearts ── */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="heart"
            style={{
              left: h.left,
              animationDuration: h.animationDuration,
              animationDelay: h.animationDelay,
              fontSize: h.fontSize,
              opacity: h.opacity,
              color: h.color,
              filter: `drop-shadow(0 0 8px ${h.color}88)`,
            }}
          >
            ♥
          </div>
        ))}

        {/* ── Falling petals ── */}
        {petals.map((p) => (
          <div
            key={p.id}
            className="petal"
            style={{
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
              background: p.background,
              width: p.width,
              height: p.height,
              opacity: p.opacity,
              filter: 'drop-shadow(0 0 4px rgba(255,126,182,0.3))',
            }}
          />
        ))}
      </div>

      {/* ── Interactive Tap/Click Hearts ── */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
        <AnimatePresence>
          {clickHearts.map((ch) => (
            <motion.div
              key={ch.id}
              className="absolute select-none font-bold"
              style={{
                left: ch.x,
                top: ch.y,
                fontSize: ch.size,
                color: ch.color,
                filter: `drop-shadow(0 0 10px ${ch.color})`,
              }}
              initial={{ scale: 0, opacity: 0.95, y: 0, x: 0 }}
              animate={{
                scale: [0.8, 1.3, 0.9],
                opacity: [0.95, 1, 0],
                y: -90,
                x: ch.driftX,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              ♥
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
