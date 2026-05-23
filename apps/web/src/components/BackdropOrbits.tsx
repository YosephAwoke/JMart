import { motion } from 'framer-motion';

const motifs = [
  { icon: '✦', x: '8%', y: '18%', delay: 0, size: '3.5rem' },
  { icon: '◌', x: '84%', y: '14%', delay: 0.2, size: '4rem' },
  { icon: '⟡', x: '14%', y: '74%', delay: 0.4, size: '3rem' },
  { icon: '⌁', x: '80%', y: '72%', delay: 0.1, size: '4.25rem' },
  { icon: '✸', x: '52%', y: '10%', delay: 0.35, size: '2.75rem' },
  { icon: '◎', x: '56%', y: '82%', delay: 0.5, size: '3.25rem' }
] as const;

export function BackdropOrbits() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-24 h-80 w-80 rounded-full bg-emerald-400/18 blur-3xl dark:bg-emerald-300/14"
        animate={{ x: [0, 28, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-32 h-[28rem] w-[28rem] rounded-full bg-emerald-500/14 blur-3xl dark:bg-emerald-400/18"
        animate={{ x: [0, -34, 0], y: [0, 22, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {motifs.map((motif) => (
        <motion.div
          key={motif.icon}
          className="absolute flex items-center justify-center rounded-full border border-border/70 bg-background/35 text-sm font-black text-accent shadow-premium backdrop-blur-xl dark:bg-surface/20"
          style={{ left: motif.x, top: motif.y, width: motif.size, height: motif.size }}
          initial={{ opacity: 0.45, y: 0 }}
          animate={{ opacity: [0.35, 0.7, 0.4], y: [0, -16, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7 + motif.delay * 4, repeat: Infinity, ease: 'easeInOut', delay: motif.delay }}
        >
          <span className="select-none">{motif.icon}</span>
        </motion.div>
      ))}
    </div>
  );
}
