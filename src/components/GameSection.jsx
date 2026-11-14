import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import Reveal from './Reveal';
import GlassCard from './GlassCard';

/* ─────────────────────────────────────────────────────────────
   Card types — 8 pairs. Each has a love note revealed on match.
   ───────────────────────────────────────────────────────────── */
const CARD_TYPES = [
  { label: 'heart',   emoji: '♥',  message: 'You are loved endlessly 💖' },
  { label: 'blossom', emoji: '🌸', message: 'As beautiful as spring itself 🌷' },
  { label: 'star',    emoji: '⭐', message: 'My brightest star, always ✨' },
  { label: 'ribbon',  emoji: '🎀', message: 'A perfect gift to this world 🎁' },
  { label: 'rose',    emoji: '🌹', message: 'Every rose reminds me of you 🌹' },
  { label: 'letter',  emoji: '💌', message: 'Written in every heartbeat 💌' },
  { label: 'cake',    emoji: '🎂', message: 'Sweeter than any birthday cake 🎂' },
  { label: 'moon',    emoji: '🌙', message: 'I love you to the moon and back 🌙' },
];

/* Fisher-Yates shuffle of a doubled deck */
function createDeck() {
  const cards = [...CARD_TYPES, ...CARD_TYPES].map((t, i) => ({
    id: i,
    label:   t.label,
    emoji:   t.emoji,
    message: t.message,
    flipped: false,
    matched: false,
  }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

/* ─────────────────────────────────────────────────────────────
   Single card component — fade+scale flip (avoids backface bugs)
   ───────────────────────────────────────────────────────────── */
function Card({ card, onClick, disabled }) {
  const isFlipped = card.flipped || card.matched;
  const isClickable = !isFlipped && !disabled;

  return (
    <motion.div
      className="relative select-none"
      style={{ aspectRatio: '1', cursor: isClickable ? 'pointer' : 'default' }}
      onClick={() => isClickable && onClick(card.id)}
      whileTap={isClickable ? { scale: 0.88 } : {}}
      role="button"
      aria-label={isFlipped ? card.emoji : 'Hidden card — tap to reveal'}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={e => e.key === 'Enter' && isClickable && onClick(card.id)}
    >
      {/* ══ BACK FACE ══ */}
      <motion.div
        className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #3a1233 0%, #1a0b1f 100%)',
          border:     '1.5px solid rgba(255,126,182,0.22)',
          boxShadow:  '0 4px 14px rgba(0,0,0,0.40)',
        }}
        animate={{ opacity: isFlipped ? 0 : 1, scale: isFlipped ? 0.80 : 1 }}
        transition={{ duration: 0.22, ease: 'easeIn' }}
      >
        {/* subtle radial shine */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,126,182,0.18) 0%, transparent 65%)',
          }}
        />
        <span className="relative font-serif text-xl text-rose/50 font-bold">?</span>
      </motion.div>

      {/* ══ FRONT FACE ══ */}
      <motion.div
        className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #4d1a42 0%, #2a0e28 100%)',
          border:     card.matched
            ? '1.5px solid rgba(245,208,137,0.65)'
            : '1.5px solid rgba(255,214,224,0.22)',
          boxShadow: card.matched
            ? '0 0 20px rgba(245,208,137,0.22), 0 4px 14px rgba(0,0,0,0.40)'
            : '0 4px 14px rgba(0,0,0,0.40)',
        }}
        animate={{
          opacity: isFlipped ? 1 : 0,
          scale:   isFlipped ? 1 : 0.80,
        }}
        transition={{ duration: 0.22, delay: isFlipped ? 0.18 : 0, ease: 'easeOut' }}
      >
        {/* Gold shimmer on matched */}
        {card.matched && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{ opacity: [0.18, 0.45, 0.18] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(245,208,137,0.18) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Emoji */}
        <motion.span
          className="relative text-2xl md:text-3xl leading-none"
          animate={card.matched ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.38, delay: 0.05 }}
        >
          {card.emoji}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Love-note toast — centred fixed overlay
   ───────────────────────────────────────────────────────────── */
function NoteToast({ message }) {
  return (
    <motion.div
      className="fixed inset-x-4 top-[18%] z-50 flex justify-center pointer-events-none"
      initial={{ opacity: 0, y: -16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0,   scale: 1   }}
      exit={{    opacity: 0, y: -20, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <GlassCard className="max-w-xs w-full text-center !py-3 !px-5">
        <p className="font-serif text-base md:text-lg text-blush leading-snug">{message}</p>
      </GlassCard>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Progress dots
   ───────────────────────────────────────────────────────────── */
function ProgressBar({ matchCount, total }) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="font-sans text-[11px] text-blush/55 uppercase tracking-widest">
        Matched
      </span>
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 9, height: 9,
              background: i < matchCount ? '#f5d089' : 'rgba(255,214,224,0.18)',
            }}
            animate={i < matchCount ? { scale: [1, 1.45, 1] } : {}}
            transition={{ duration: 0.32 }}
          />
        ))}
      </div>
      <span className="font-serif text-gold text-sm font-semibold tabular-nums">
        {matchCount}/{total}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   GameSection
   ══════════════════════════════════════════════════════════════ */
export default function GameSection() {
  const [deck,       setDeck]       = useState(createDeck);
  const [selected,   setSelected]   = useState([]);   // card ids
  const [checking,   setChecking]   = useState(false);
  const [toast,      setToast]      = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [won,        setWon]        = useState(false);
  const prefersReduced              = useReducedMotion();
  const toastTimerRef               = useRef(null);
  const checkTimerRef               = useRef(null);

  /* ── Show a toast for 2.8 s ── */
  const showToast = useCallback(msg => {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  /* ── Tap a card ── */
  const handleCardClick = useCallback(cardId => {
    if (checking) return;
    setDeck(prev => {
      const c = prev.find(x => x.id === cardId);
      if (!c || c.flipped || c.matched) return prev;
      return prev.map(x => x.id === cardId ? { ...x, flipped: true } : x);
    });
    setSelected(prev => {
      if (prev.length === 0)                return [cardId];
      if (prev.length === 1 && prev[0] !== cardId) return [prev[0], cardId];
      return prev;
    });
  }, [checking]);

  /* ── Check pair when 2 selected ── */
  useEffect(() => {
    if (selected.length !== 2) return;
    setChecking(true);
    const [id1, id2] = selected;

    checkTimerRef.current = setTimeout(() => {
      setDeck(prev => {
        const c1 = prev.find(c => c.id === id1);
        const c2 = prev.find(c => c.id === id2);
        if (!c1 || !c2) return prev;

        if (c1.label === c2.label) {
          /* ✅ MATCH */
          showToast(c1.message);

          if (!prefersReduced) {
            confetti({
              particleCount: 35, spread: 65, startVelocity: 22,
              origin: { x: 0.5, y: 0.55 },
              colors: ['#ff7eb6', '#ffd6e0', '#f5d089', '#ffb3cc'],
              scalar: 1.1, ticks: 160, gravity: 1.1,
            });
          }

          setMatchCount(n => {
            const next = n + 1;
            if (next === CARD_TYPES.length) setTimeout(() => setWon(true), 600);
            return next;
          });
          return prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, matched: true, flipped: true } : c
          );
        } else {
          /* ❌ NO MATCH — flip back */
          return prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c
          );
        }
      });
      setSelected([]);
      setChecking(false);
    }, 860);

    return () => clearTimeout(checkTimerRef.current);
  }, [selected, showToast, prefersReduced]);

  /* ── Big win confetti ── */
  useEffect(() => {
    if (!won || prefersReduced) return;
    const colors = ['#ff7eb6', '#ffd6e0', '#f5d089', '#ffb3cc', '#fffbe0'];
    confetti({
      particleCount: 160, spread: 120, startVelocity: 42,
      origin: { x: 0.5, y: 0.5 }, colors, scalar: 1.5, ticks: 420, gravity: 0.78,
    });
  }, [won, prefersReduced]);

  /* ── Reset ── */
  const resetGame = () => {
    clearTimeout(toastTimerRef.current);
    clearTimeout(checkTimerRef.current);
    setDeck(createDeck());
    setSelected([]);
    setChecking(false);
    setToast(null);
    setMatchCount(0);
    setWon(false);
  };

  return (
    <section className="relative py-20 px-4 section-glow-rose" aria-label="Memory matching game">

      {/* ── Toast ── */}
      <AnimatePresence mode="wait">
        {toast && <NoteToast key={toast} message={toast} />}
      </AnimatePresence>

      {/* ── Heading ── */}
      <Reveal>
        <div className="section-heading mb-8">
          <h2 className="font-script text-5xl md:text-6xl shimmer-rose">A Game for You</h2>
          <p className="font-sans text-blush/45 text-xs tracking-[0.22em] uppercase mt-3">
            match the cards · unlock my love notes
          </p>
        </div>
      </Reveal>

      {/* ── Progress bar ── */}
      <Reveal delay={0.12} className="max-w-[360px] mx-auto mb-5">
        <GlassCard padding={false} className="px-5 py-3">
          <ProgressBar matchCount={matchCount} total={CARD_TYPES.length} />
        </GlassCard>
      </Reveal>

      {/* ── Card grid ── */}
      <div className="max-w-[360px] md:max-w-[420px] mx-auto">
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {deck.map(card => (
            <Card
              key={card.id}
              card={card}
              onClick={handleCardClick}
              disabled={checking || won}
            />
          ))}
        </div>
      </div>

      {/* ── Win state ── */}
      <AnimatePresence>
        {won && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-5 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            {/* Big win message */}
            <motion.p
              className="font-script text-4xl md:text-5xl text-rose"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              You matched all my love! 💖
            </motion.p>

            <GlassCard className="max-w-xs text-center">
              <p className="font-serif text-base md:text-lg text-blush/80 italic leading-relaxed">
                Just like you, everything you do fits perfectly.
              </p>
            </GlassCard>

            {/* Replay */}
            <motion.button
              className="font-sans text-xs text-blush/50 uppercase tracking-[0.2em]
                         border border-blush/20 rounded-full px-6 py-2.5
                         hover:border-rose/50 hover:text-rose/80 transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
              onClick={resetGame}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.04 }}
            >
              play again  ↺
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hint (first-time only) ── */}
      {matchCount === 0 && (
        <Reveal delay={0.5}>
          <p className="text-center font-sans text-[11px] text-blush/30 tracking-widest mt-5">
            tap any card to begin
          </p>
        </Reveal>
      )}
    </section>
  );
}

