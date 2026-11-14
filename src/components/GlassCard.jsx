/**
 * GlassCard — reusable glass-morphism card component.
 * Props:
 *   className  — extra Tailwind classes
 *   children   — card content
 *   padding    — whether to apply default padding (default: true)
 */
export default function GlassCard({ children, className = '', padding = true }) {
  return (
    <div
      className={[
        'relative rounded-3xl',
        'bg-white/[0.08]',
        'backdrop-blur-xl',
        'border border-blush/30',
        'shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_24px_rgba(255,126,182,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)]',
        padding ? 'p-6 md:p-8' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

