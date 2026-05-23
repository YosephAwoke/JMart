import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  const { openCart, items } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/55 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/40 bg-surface/70 px-3 py-2 backdrop-blur-xl">
          <p className="font-display text-lg font-extrabold tracking-tight">JMart</p>
          <p className="text-xs text-muted">Premium Ethiopian commerce</p>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavItem to="/" label="Home" />
          <NavItem to="/catalog" label="Catalog" />
          <NavItem to="/checkout" label="Checkout" />
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openCart}
            className="rounded-full border border-border/50 bg-surface/80 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl transition hover:border-accent/40 hover:shadow-premium"
          >
            Cart <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{items.length}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-full px-3 py-1.5 transition',
          isActive ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:text-accent'
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}