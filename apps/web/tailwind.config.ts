import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--surface-alt) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)'
      },
      fontFamily: {
        display: ['"Segoe UI"', 'system-ui', 'sans-serif'],
        body: ['"Segoe UI"', 'system-ui', 'sans-serif'],
        amharic: ['"Noto Sans Ethiopic"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        premium: '0 20px 60px rgba(15, 23, 42, 0.12)',
        glow: '0 0 0 1px rgba(16, 185, 129, 0.08), 0 20px 60px rgba(16, 185, 129, 0.16)'
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
} satisfies Config;