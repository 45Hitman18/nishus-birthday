import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

/* ── Beautiful Famous Love Shayari ── */
const SHAYARI_VERSES = [
  "Tere aane se meri zindagi mein roshni ho gayi,",
  "Teri baaton se har ek ghadi shayari ho gayi...",
  "Dua hai rab se ki teri har subah aisi hi muskuraye,",
  "Kyunki teri khushi hi meri poori duniya ban gayi. ✨"
];

/* ══════════════════════════════════════════════════════════════
   VideoSection
   Props:
     audioRef — ref to the global <audio> background music element
   ══════════════════════════════════════════════════════════════ */
export default function VideoSection({ audioRef }) {
  const videoRef  = useRef(null);
  const [started, setStarted] = useState(false); // true once user taps play

  /* ── Music helpers ── */
  const pauseMusic = () => {
    const a = audioRef?.current;
    if (a && !a.paused) a.pause();
  };
  const resumeMusic = () => {
    audioRef?.current?.play().catch(() => {});
  };

  /* ── Custom play-button tap ── */
  const handlePlayClick = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    pauseMusic();
    v.play().catch(() => {});
  };

  return (
    <section className="py-20 px-4 section-glow-rose" aria-label="Video message">

      {/* ── Heading ── */}
      <Reveal>
        <div className="section-heading mb-10">
          <h2 className="font-script text-5xl md:text-6xl shimmer-rose">
            A little something for you
          </h2>
          <p className="font-sans text-blush/45 text-xs tracking-[0.22em] uppercase mt-3">
            just for you
          </p>
        </div>
      </Reveal>

      {/* ── Video player ── */}
      <Reveal delay={0.15} className="w-full flex justify-center">
        <div className="video-container">

          {/* Native video element */}
          <video
            ref={videoRef}
            className="video-player"
            src="/video/message.mp4"
            poster="/photos/1.jpeg"
            playsInline
            preload="metadata"
            controls={started}           /* native controls only after first tap */
            onPlay={pauseMusic}          /* handles play via native controls too */
            onPause={resumeMusic}
            onEnded={resumeMusic}
          />

          {/* ── Custom play overlay (hidden once video starts) ── */}
          <AnimatePresence>
            {!started && (
              <motion.div
                key="play-overlay"
                className="video-overlay"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Ambient glow pulse behind button */}
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 140, height: 140,
                    background: 'radial-gradient(circle, rgba(255,126,182,0.18) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.button
                  className="play-btn"
                  onClick={handlePlayClick}
                  aria-label="Play video"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1,    opacity: 1 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 180 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{  scale: 0.93 }}
                >
                  {/* SVG play triangle — optically centred */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 fill-cream"
                    style={{ marginLeft: 3 }}
                    aria-hidden="true"
                  >
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      {/* ── Poetic Love Shayari ── */}
      <Reveal delay={0.3} className="max-w-xl mx-auto mt-8 text-center px-4">
        <div className="relative py-4 px-6 rounded-2xl backdrop-blur-md bg-white/[0.04] border border-blush/20 shadow-[0_4px_24px_rgba(255,126,182,0.1)]">
          {/* Subtle decorative ornament */}
          <div className="flex items-center justify-center gap-3 mb-3 text-gold/60 text-xs">
            <span>✧</span>
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-rose/40" />
            <span className="text-rose text-sm">♥</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-rose/40" />
            <span>✧</span>
          </div>

          <div className="space-y-1.5">
            {SHAYARI_VERSES.map((line, i) => (
              <p
                key={i}
                className="font-serif text-lg md:text-xl text-blush/90 leading-relaxed italic tracking-wide"
                style={{
                  textShadow: '0 0 12px rgba(255, 214, 224, 0.25)',
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

