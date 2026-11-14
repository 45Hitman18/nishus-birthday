import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/* ─────────────────────────────────────────────────────────────
   REPLACE these arrays with your actual letter and shayari text.
   Empty strings '' become blank lines (paragraph breaks).
   ───────────────────────────────────────────────────────────── */
const LETTER_LINES = [
  'My dearest,',
  '',
  'I have been trying to find the right words for a while now,',
  'and I think I have finally accepted that there are none.',
  'No sentence is clever enough to hold what I feel for you.',
  '',
  'So let me just say this:',
  'Thank you for existing.',
  'Thank you for being exactly who you are.',
  'Thank you for making every ordinary day feel extraordinary.',
  '',
  'You deserve all the happiness in the world — and I mean that',
  'more than I have ever meant anything.',
  '',
  'Happy birthday, my love.',
  'May every year bring you more joy than the last.',
  '',
  'Always yours,',
  '— Someone who thinks about you far too much  🎀',
];

/* Each string is one line of shayari (rendered in Great Vibes gold) */
const SHAYARI_LINES = [
  'Tujhse hi subah, tujhse hi shaam hai,',
  'Teri muskaan mera ek khaas kaam hai.',
  'Jo hasna bhula tha, tune sikhaya hai,',
  'Tujhe dekhke lagta — zindagi ne kuch paya hai.',
];

/* ── Typing animation config ── */
const CHAR_SPEED_MS  = 22;   // ms per character
const LINE_PAUSE_MS  = 240;  // ms pause between lines
const START_DELAY_MS = 500;  // initial delay before typing begins

/* ─────────────────────────────────────────────────────────────
   useLetterTypewriter
   Returns an array of partial strings (one per line in LETTER_LINES).
   Starts typing when `inView` becomes true; runs once.
   ───────────────────────────────────────────────────────────── */
function useLetterTypewriter(inView) {
  const [typed, setTyped]   = useState(() => LETTER_LINES.map(() => ''));
  const startedRef          = useRef(false);
  const timeoutRef          = useRef(null);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    let lineIdx = 0;
    let charIdx = 0;

    function tick() {
      if (lineIdx >= LETTER_LINES.length) return;

      const line = LETTER_LINES[lineIdx];

      if (charIdx < line.length) {
        charIdx++;
        const li = lineIdx;
        const ci = charIdx;
        setTyped(prev => {
          const next = [...prev];
          next[li] = line.slice(0, ci);
          return next;
        });
        timeoutRef.current = setTimeout(tick, CHAR_SPEED_MS);
      } else {
        /* Finished current line — move to next */
        lineIdx++;
        charIdx = 0;
        timeoutRef.current = setTimeout(tick, LINE_PAUSE_MS);
      }
    }

    timeoutRef.current = setTimeout(tick, START_DELAY_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inView]);

  return typed;
}

/* ─────────────────────────────────────────────────────────────
   TypewriterLetter — renders the letter with line-by-line typing
   ───────────────────────────────────────────────────────────── */
function TypewriterLetter() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });
  const typed            = useLetterTypewriter(inView);

  return (
    <div
      ref={ref}
      className="font-sans text-sm md:text-[15px] text-wine/80 leading-loose"
    >
      {LETTER_LINES.map((line, i) => (
        <div key={i} className="min-h-[1.75em]">
          {line === '' ? (
            /* blank line → paragraph gap */
            <span aria-hidden="true">&nbsp;</span>
          ) : (
            <>
              {typed[i] ?? ''}
              {/* Blinking cursor only on the currently-typing line */}
              {typed[i] !== undefined &&
               typed[i].length > 0 &&
               typed[i].length < line.length && (
                <span className="letter-cursor" aria-hidden="true">|</span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ShayariLines — each line fades in from below, staggered
   ───────────────────────────────────────────────────────────── */
function ShayariLines() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div ref={ref} className="text-center mt-10 space-y-3" aria-label="Shayari">
      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose/40" />
        <span className="text-rose/50 text-lg">✦</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose/40" />
      </div>

      {SHAYARI_LINES.map((line, i) => (
        <motion.p
          key={i}
          className="font-script text-2xl md:text-3xl text-gold drop-shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay:    0.2 + i * 0.55,
            duration: 0.85,
            ease:     'easeOut',
          }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LetterSection — the full section
   ══════════════════════════════════════════════════════════════ */
export default function LetterSection() {
  return (
    <section className="py-20 px-4 section-glow-gold" aria-label="Love letter">

      {/* ── Section heading ── */}
      <motion.div
        className="section-heading mb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-script text-5xl md:text-6xl shimmer-rose">A Letter for You</h2>
        <p className="font-sans text-blush/45 text-xs tracking-[0.22em] uppercase mt-3">
          from the heart
        </p>
      </motion.div>

      <div className="max-w-xl mx-auto">
        {/* ── Cream paper card ── */}
        <motion.div
          className="paper-card relative"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          {/* Wax-seal heart — sits above the top edge */}
          <div className="wax-seal" aria-hidden="true">
            <span className="wax-heart">&#x2764;</span>
          </div>

          {/* Letter body */}
          <div className="pt-14 px-6 md:px-10 pb-10">
            <TypewriterLetter />
          </div>

          {/* Corner dog-ear fold (decorative) */}
          <div className="paper-fold" aria-hidden="true" />
        </motion.div>

        {/* ── Shayari below the card ── */}
        <ShayariLines />
      </div>
    </section>
  );
}

