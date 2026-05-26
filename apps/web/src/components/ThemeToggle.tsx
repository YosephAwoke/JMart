import { motion } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface shadow-sm"
      aria-label="Toggle theme"
    >
      <span className="relative z-10">
        {theme === 'dark' ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
          </svg>
        )}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent" />
    </motion.button>
  );
}