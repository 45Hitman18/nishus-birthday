import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Reveal from './Reveal';

/* -----------------------------------------------------------------
   Timeline data - swap in the real story text here.
   ----------------------------------------------------------------- */
const EVENTS = [
  {
    date: '14 Oct 2025',
    title: 'The First Message',
    emoji: String.fromCodePoint(0x1F48C),
    /* Replace with your "Little Story" text */
    story: `It started with a simple hi — nervous fingers, a racing heart, and no idea that this one message would change everything. You replied within minutes, and just like that, a whole new chapter began. We talked about nothing and everything at once, and somehow the hours just vanished. The little story of us had quietly, beautifully, begun.`,
  },
  {
    date: '22 Nov',
    title: 'Your Special Day',
    emoji: String.fromCodePoint(0x1F382),
    /* Replace with your "Your Special Day" text */
    story: `The day the world got a little brighter — the day you were born. If I could go back and whisper to the universe on that day, I would say: Take extra care of this one. She is going to mean the world to someone. Every single year of your life has been a gift, and I am so endlessly grateful you are in mine. Happy birthday, my love.`,
  },
  {
    date: '24 Nov',
    title: 'Hum Lover Hai',
    emoji: String.fromCodePoint(0x2764) + String.fromCodePoint(0xFE0F),
    /* Replace with your "Our Little Beginning" text */
    story: `Three little words that redrew the whole map. Said softly, a little nervously, with a smile that gave everything away before the words even landed. From that moment everything felt different — warmer, more colourful, like a song you have always known but only now truly understand. Our little beginning, written in the stars all along.`,
  },
];

/* --- Pulsing heart node on the timeline line --- */
function HeartNode({ index }) {
  return (
    <motion.div
      className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full border-2 border-rose bg-wine flex items-center justify-center text-rose text-sm select-none"
      style={{ boxShadow: '0 0 0 4px rgba(255,126,182,0.10), 0 0 14px rgba(255,126,182,0.45)' }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.55 }}
      aria-hidden="true"
    >
      {String.fromCodePoint(0x2665)}
    </motion.div>
  );
}

/* --- Single timeline entry --- */
function TimelineNode({ event, index }) {
  return (
    <div className="relative flex gap-5 md:gap-7 items-start">
      <HeartNode index={index} />
      <Reveal delay={index * 0.13} y={24} className="flex-1 min-w-0 pb-2">
        <GlassCard>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl leading-none">{event.emoji}</span>
            <span className="font-sans text-[11px] text-rose/60 uppercase tracking-widest">
              {event.date}
            </span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-blush mb-3 leading-snug">
            {event.title}
          </h3>
          <p className="font-sans text-sm md:text-base text-cream/70 leading-relaxed">
            {event.story}
          </p>
        </GlassCard>
      </Reveal>
    </div>
  );
}

/* ==============================================
   Timeline section
   ============================================== */
export default function Timeline() {
  return (
    <section className="relative py-20 px-4 section-glow-rose" aria-label="Our story timeline">
      <Reveal>
        <div className="section-heading mb-16">
          <h2 className="font-script text-5xl md:text-6xl shimmer-rose">Our Story</h2>
          <p className="font-sans text-blush/45 text-xs tracking-[0.22em] uppercase mt-3">
            written in moments
          </p>
        </div>
      </Reveal>

      <div className="relative max-w-xl mx-auto">
        {/* Glowing vertical rose line — left:15px = center of w-8 heart node */}
        <div
          className="timeline-line absolute top-4 bottom-4"
          style={{ left: 15 }}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-12">
          {EVENTS.map((event, i) => (
            <TimelineNode key={event.date} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}