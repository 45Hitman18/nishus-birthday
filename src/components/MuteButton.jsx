import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * MuteButton — floating bottom-right mute/unmute toggle
 * with an animated mini equalizer when playing.
 */
export default function MuteButton({ audioRef }) {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    if (!audioRef?.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    setMuted(next);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      className="fixed z-40 flex items-center justify-center rounded-full
                 bg-white/[0.08] backdrop-blur-xl
                 border border-blush/30
                 shadow-[0_4px_20px_rgba(255,126,182,0.2),0_0_12px_rgba(255,126,182,0.12)]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60
                 group overflow-hidden"
      style={{
        width:  46,
        height: 46,
        right:  '1rem',
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 220, damping: 16 }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
    >
      {muted ? (
        /* Muted icon */
        <span className="text-blush/60 text-lg">🔇</span>
      ) : (
        /* Mini equalizer bars */
        <div className="flex items-end gap-[3px] h-[18px]">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: 3,
                background: 'linear-gradient(to top, #ff7eb6, #f5d089)',
              }}
              animate={{ height: ['30%', '100%', '50%', '85%', '30%'] }}
              transition={{
                duration: 0.9 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}
