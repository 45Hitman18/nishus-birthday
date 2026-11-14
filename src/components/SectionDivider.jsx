import { motion } from 'framer-motion';
import Reveal from './Reveal';

/**
 * SectionDivider — beautiful ornamental divider between major sections.
 * Variants: 'rose' (default), 'gold', 'blush'
 */
export default function SectionDivider({ variant = 'rose' }) {
  const colors = {
    rose:  { line: '#ff7eb6', glow: 'rgba(255,126,182,0.5)',  dot: '#ff7eb6' },
    gold:  { line: '#f5d089', glow: 'rgba(245,208,137,0.5)',  dot: '#f5d089' },
    blush: { line: '#ffd6e0', glow: 'rgba(255,214,224,0.45)', dot: '#ffd6e0' },
  };
  const c = colors[variant] || colors.rose;

  return (
    <Reveal className="w-full">
      <div className="flex items-center justify-center gap-3 py-6 px-8 max-w-md mx-auto">
        {/* Left line */}
        <div className="flex-1 h-px relative">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, transparent, ${c.line})`,
              boxShadow: `0 0 8px ${c.glow}`,
            }}
          />
        </div>

        {/* Centre ornament — animated sparkle heart */}
        <motion.div
          className="flex items-center gap-2 select-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px]" style={{ color: c.dot }}>✦</span>
          <span className="text-lg" style={{ color: c.dot, filter: `drop-shadow(0 0 6px ${c.glow})` }}>♥</span>
          <span className="text-[10px]" style={{ color: c.dot }}>✦</span>
        </motion.div>

        {/* Right line */}
        <div className="flex-1 h-px relative">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to left, transparent, ${c.line})`,
              boxShadow: `0 0 8px ${c.glow}`,
            }}
          />
        </div>
      </div>
    </Reveal>
  );
}

