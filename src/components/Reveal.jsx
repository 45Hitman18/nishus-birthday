import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Reveal — animates children in with fade + slide-up when scrolled into view.
 * Respects prefers-reduced-motion.
 *
 * Props:
 *   delay     — stagger delay in seconds (default: 0)
 *   duration  — animation duration in seconds (default: 0.6)
 *   y         — slide distance in px (default: 30)
 *   className — extra wrapper classes
 *   children  — content to reveal
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 30,
  className = '',
}) {
  const prefersReduced = useReducedMotion();
  const { ref, inView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const variants = prefersReduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

