import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ParticleBackground    from './components/ParticleBackground';
import ScrollProgress        from './components/ScrollProgress';
import EnvelopeIntro         from './components/EnvelopeIntro';
import MuteButton            from './components/MuteButton';
import Hero                  from './components/Hero';
import SectionDivider        from './components/SectionDivider';
import Timeline              from './components/Timeline';
import Gallery               from './components/Gallery';
import VideoSection          from './components/VideoSection';
import LetterSection         from './components/LetterSection';
import GameSection           from './components/GameSection';
import CelebrationSection    from './components/CelebrationSection';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const audioRef = useRef(null);

  return (
    <div className="relative min-h-[100dvh] bg-animated font-sans text-cream overflow-x-hidden">

      {/* ── Background music ── */}
      <audio ref={audioRef} src="/audio/music.mp3" loop preload="auto" playsInline />

      {/* ── Ambient background ── */}
      <ParticleBackground />
      <div className="rose-glow" aria-hidden="true" />

      {/* ── Scroll progress bar (visible after intro) ── */}
      {introComplete && <ScrollProgress />}

      {/* ── Envelope intro ── */}
      <AnimatePresence>
        {!introComplete && (
          <EnvelopeIntro
            key="intro"
            audioRef={audioRef}
            onComplete={() => setIntroComplete(true)}
          />
        )}
      </AnimatePresence>

      {/* ── Floating mute button ── */}
      {introComplete && <MuteButton audioRef={audioRef} />}

      {/* ── Page sections with ornamental dividers ── */}
      <main className="relative z-10">
        <Hero />

        <SectionDivider variant="rose" />
        <Timeline />

        <SectionDivider variant="gold" />
        <Gallery />

        <SectionDivider variant="blush" />
        <VideoSection audioRef={audioRef} />

        <SectionDivider variant="rose" />
        <LetterSection />

        <SectionDivider variant="gold" />
        <GameSection />

        <SectionDivider variant="blush" />
        <CelebrationSection />
      </main>
    </div>
  );
}
