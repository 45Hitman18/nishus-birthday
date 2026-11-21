import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

/* ─────────────────────────────────────────────────────────────
   Photo data — add photos to /public/photos/ as photo1.webp … photo6.webp
   Update captions here to match your actual photos.
   ───────────────────────────────────────────────────────────── */
const PHOTOS = [
  { src: '/photos/1.jpeg', caption: 'Where it all began 🌸' },
  { src: '/photos/2.jpeg', caption: 'The smile that started everything' },
  { src: '/photos/3.jpeg', caption: 'Our little corner of the world' },
  { src: '/photos/4.jpeg', caption: 'Moments like these 💛' },
  { src: '/photos/5.jpeg', caption: 'You, always you' },
  { src: '/photos/6.jpeg', caption: 'Forever feels too short 🎀' },
];

/* Pre-computed so they're stable across renders (no random on each paint) */
const ROTATIONS = [-2.8, 1.5, -1.2, 2.4, -2.0, 1.7];
const FLOAT_DURATION = [3.2, 2.8, 3.6, 3.0, 2.6, 3.4];
const FLOAT_DELAY = [0.0, 0.5, 0.9, 0.25, 0.65, 1.1];

/* ─── Polaroid card (carousel item) ─── */
function PolaroidCard({ photo, index, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    /*
      Two-wrapper pattern:
        outer div  — static CSS rotation (avoids framer-motion transform compositing issues)
        motion.div — handles y float animation
    */
    <div
      className="gallery-item"
      style={{ transform: `rotate(${ROTATIONS[index]}deg)` }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{
          duration: FLOAT_DURATION[index],
          repeat: Infinity,
          ease: 'easeInOut',
          delay: FLOAT_DELAY[index],
          repeatType: 'loop',
        }}
      >
        <div
          className="polaroid cursor-pointer"
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label={`Open photo: ${photo.caption}`}
          onKeyDown={e => e.key === 'Enter' && onClick()}
        >
          {/* Photo area with instant loading & smooth fade */}
          <div className="polaroid-photo relative overflow-hidden bg-rose/10">
            {imgError ? (
              /* Placeholder when file doesn't exist yet */
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
                <span className="text-4xl">🌸</span>
                <span className="font-sans text-xs text-wine/60">photo {index + 1}</span>
              </div>
            ) : (
              <>
                {/* Subtle soft shimmer placeholder while image loads */}
                {!isLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-rose/15 via-blush/20 to-wine/20 flex items-center justify-center">
                    <span className="text-xl opacity-35">🌸</span>
                  </div>
                )}
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="eager"
                  decoding="async"
                  fetchPriority={index < 2 ? "high" : "auto"}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => setImgError(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </>
            )}
          </div>

          {/* Handwritten caption */}
          <p className="polaroid-caption font-script">{photo.caption}</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Fullscreen lightbox ─── */
function Lightbox({ index, onClose, onPrev, onNext }) {
  const photo = PHOTOS[index];
  const [imgError, setImgError] = useState(false);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  /* Prevent body scroll while open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      key="lightbox"
      className="fixed inset-0 z-[60] flex items-center justify-center p-6"
      style={{ background: 'rgba(10,3,16,0.90)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={`Full size photo: ${photo.caption}`}
    >
      {/* Backdrop blur via CSS filter on a pseudo-layer */}
      <div className="absolute inset-0 backdrop-blur-sm" aria-hidden="true" />

      {/* ── Polaroid in lightbox ── */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.82, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.82, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="polaroid polaroid-lg mx-auto">
          <div className="polaroid-photo polaroid-photo-lg">
            {imgError ? (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                <span className="text-5xl">🌸</span>
              </div>
            ) : (
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <p className="polaroid-caption font-script text-lg">{photo.caption}</p>
        </div>

        {/* Counter */}
        <p className="text-center font-sans text-xs text-blush/40 mt-3 tracking-widest">
          {index + 1} / {PHOTOS.length}
        </p>

        {/* Close */}
        <button
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-wine border border-blush/30
                     flex items-center justify-center text-cream text-sm
                     hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ✕
        </button>

        {/* Prev */}
        <button
          className="absolute top-1/2 -translate-y-1/2 -left-6 w-9 h-9 rounded-full bg-wine border border-blush/30
                     flex items-center justify-center text-cream text-xl
                     hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
          onClick={e => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous photo"
        >
          ‹
        </button>

        {/* Next */}
        <button
          className="absolute top-1/2 -translate-y-1/2 -right-6 w-9 h-9 rounded-full bg-wine border border-blush/30
                     flex items-center justify-center text-cream text-xl
                     hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
          onClick={e => { e.stopPropagation(); onNext(); }}
          aria-label="Next photo"
        >
          ›
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Gallery section
   ══════════════════════════════════════════════ */
export default function Gallery() {
  const [lightbox, setLightbox] = useState(null); // null = closed, number = open index

  // Proactively warm browser cache so swiping on mobile is instant
  useEffect(() => {
    PHOTOS.forEach(p => {
      const img = new Image();
      img.src = p.src;
    });
  }, []);

  const openLightbox = useCallback(i => setLightbox(i), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(() => setLightbox(i => (i - 1 + PHOTOS.length) % PHOTOS.length), []);
  const nextPhoto = useCallback(() => setLightbox(i => (i + 1) % PHOTOS.length), []);

  return (
    <section className="py-20 section-glow-gold" aria-label="Photo gallery">
      {/* Heading */}
      <Reveal>
        <div className="section-heading mb-10 px-4">
          <h2 className="font-script text-5xl md:text-6xl shimmer-rose">Our Moments</h2>
          <p className="font-sans text-blush/45 text-xs tracking-[0.22em] uppercase mt-3">
            captured in light
          </p>
        </div>
      </Reveal>

      {/* ── Swipeable carousel ── */}
      <div
        className="gallery-carousel"
        role="list"
        aria-label="Swipeable photo carousel — drag to browse"
      >
        {PHOTOS.map((photo, i) => (
          <PolaroidCard
            key={i}
            photo={photo}
            index={i}
            onClick={() => openLightbox(i)}
          />
        ))}
      </div>

      {/* Swipe hint (hidden once user interacts) */}
      <p className="text-center font-sans text-[11px] text-blush/30 tracking-widest mt-2 px-4">
        swipe to browse · tap to open
      </p>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            index={lightbox}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

