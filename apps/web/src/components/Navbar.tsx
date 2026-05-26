import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';
import { useAuth } from '../providers/AuthProvider';
import { useLocale } from '../providers/LocaleProvider';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { openCart, items } = useCart();
  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.user);

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
          {isLoggedIn ? <NavItem to="/favorites" label="Favorites" /> : null}
          <NavItem to="/about" label="About" />
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? <UserMenu name={auth.user?.fullName || auth.user?.phone || 'Account'} /> : <NavLink to="/login" className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white">Sign in</NavLink>}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openCart}
            className="rounded-full border border-border/50 bg-surface/80 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl transition hover:border-accent/40 hover:shadow-premium"
          >
            Cart <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{items.length}</span>
          </motion.button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['rounded-full px-3 py-1.5 transition', isActive ? 'bg-accent/10 text-accent' : 'text-foreground/80 hover:text-accent'].join(' ')}
    >
      {label}
    </NavLink>
  );
}

function UserMenu({ name }: { name: string }) {
  const { logout } = useAuth();
  const { language, setLanguage } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        onMouseEnter={() => setOpen(true)}
        className="rounded-full border border-border/50 bg-surface/80 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl transition hover:border-accent/40 hover:shadow-premium"
      >
        {name}
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] w-72 overflow-hidden rounded-[1.5rem] border border-border bg-surface p-3 shadow-premium" onMouseLeave={() => setOpen(false)}>
          <MenuLink to="/account" title="Profile" description="Account info, password, address, and orders." onSelect={() => setOpen(false)} />
          <div className="mt-3 space-y-2 rounded-2xl border border-border bg-background p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Language</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { code: 'en', label: 'English' },
                { code: 'am', label: 'Amharic' }
              ] as const).map((entry) => (
                <button
                  key={entry.code}
                  type="button"
                  onClick={() => {
                    setLanguage(entry.code);
                    setOpen(false);
                  }}
                  className={['rounded-2xl border px-3 py-2 text-sm font-semibold transition', language === entry.code ? 'border-accent bg-accent text-white' : 'border-border bg-surfaceAlt'].join(' ')}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
          <MenuLink to="/about" title="About" description="Learn about JMart and the founder." onSelect={() => setOpen(false)} />
          <div className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-2">
            <Link to="/favorites" onClick={() => setOpen(false)} className="rounded-2xl border border-border bg-surfaceAlt px-3 py-2 text-center text-sm font-semibold">
              Favorites
            </Link>
            <button type="button" onClick={() => { logout(); setOpen(false); }} className="rounded-2xl border border-border bg-surfaceAlt px-3 py-2 text-sm font-semibold">
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ to, title, description, onSelect }: { to: string; title: string; description: string; onSelect: () => void }) {
  return (
    <Link to={to} onClick={onSelect} className="mt-2 block rounded-2xl border border-border bg-background p-3 transition hover:border-accent/40 hover:bg-surfaceAlt">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
    </Link>
  );
}