import { motion } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold shadow-sm"
      aria-label="Toggle theme"
    >
      <span className="relative z-10">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
      <span className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent" />
    </motion.button>
  );
}