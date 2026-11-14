import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ScrollProgress — a thin glowing progress bar at the very top of the viewport
 * that fills as you scroll. Also shows a floating "back to top" pill when
 * scrolled past 60%.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Top progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[55] h-[3px] pointer-events-none">
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #ff7eb6 0%, #f5d089 50%, #ffd6e0 100%)',
            boxShadow: '0 0 12px rgba(255,126,182,0.65), 0 0 24px rgba(245,208,137,0.35)',
            scaleX: progress / 100,
          }}
        />
      </div>

      {/* ── Back-to-top pill ── */}
      {!prefersReduced && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed z-40 left-4 rounded-full
                     bg-white/[0.08] backdrop-blur-xl
                     border border-blush/25
                     shadow-[0_4px_20px_rgba(255,126,182,0.18)]
                     text-blush text-sm
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60
                     flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={progress > 15 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      )}
    </>
  );
}

