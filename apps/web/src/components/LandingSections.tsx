import { Link } from 'react-router-dom';
import { mockCatalog } from '../data/mockCatalog';

const categoryCards = [
  {
    title: 'Bags & carry',
    description: 'Daily essentials, office carry, and weekend bags.',
    href: '/catalog',
    accent: 'from-emerald-500/20 to-transparent'
  },
  {
    title: 'Footwear',
    description: 'Clean silhouettes built for comfort and movement.',
    href: '/catalog',
    accent: 'from-indigo-500/20 to-transparent'
  },
  {
    title: 'Fragrance & gifts',
    description: 'Premium picks for gifting and personal use.',
    href: '/catalog',
    accent: 'from-amber-500/20 to-transparent'
  }
];

export function StoreHighlights() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <HighlightCard title="Fast delivery" text="Clear shipping details and local address fields for Ethiopia." />
      <HighlightCard title="Easy checkout" text="Quick order flow with a clean payment handoff." />
      <HighlightCard title="Curated collection" text="Best sellers and new arrivals surfaced first." />
    </section>
  );
}

export function CategoryStrip() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Shop by category</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Find the right item quickly.</h2>
        </div>
        <Link to="/catalog" className="rounded-full border border-border bg-surfaceAlt px-4 py-2 text-sm font-semibold">
          Browse all products
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categoryCards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="group overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm transition hover:shadow-premium"
          >
            <div className={`rounded-[1.5rem] bg-gradient-to-br ${card.accent} p-5`}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Collection</p>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{card.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function BestSellersStory() {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-border bg-surface p-6 shadow-premium lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Why customers shop here</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">A simple store with thoughtful details.</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
          JMart is built around the parts shoppers care about most: easy browsing, visible prices, clear delivery steps, and a polished checkout.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <StoryStat label="Products" value={`${mockCatalog.length}+`} />
          <StoryStat label="Support" value="Local delivery" />
          <StoryStat label="Payments" value="Chapa checkout" />
          <StoryStat label="Experience" value="Light & dark" />
        </div>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-border bg-surfaceAlt p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Popular now</p>
        {mockCatalog.slice(0, 3).map((product) => (
          <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-3">
            <img src={product.images[0]?.url} alt={product.images[0]?.alt.en} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{product.title.en}</p>
              <p className="text-sm text-muted">ETB {product.price.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PremiumFooter() {
  return (
    <footer className="mt-4 overflow-hidden rounded-[2.25rem] border border-border/50 bg-background/60 px-6 py-8 shadow-premium backdrop-blur-2xl lg:px-8">
      <div className="mb-8 rounded-[1.75rem] border border-border bg-gradient-to-r from-accent/10 via-surface/80 to-indigo-500/10 p-5 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Stay in the loop</p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-display text-2xl font-black tracking-tight">New arrivals, drops, and checkout updates.</h3>
            <p className="mt-1 text-sm text-muted">A small, polished footer area works like the real stores customers are used to.</p>
          </div>
          <Link to="/catalog" className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
            Browse the catalog
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-2xl font-black tracking-tight">JMart</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            A premium Ethiopian ecommerce storefront with curated products, quick checkout, and a polished shopping experience.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Shop</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link to="/catalog" className="hover:text-accent">Catalog</Link></li>
            <li><Link to="/checkout" className="hover:text-accent">Checkout</Link></li>
            <li><Link to="/" className="hover:text-accent">Home</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>Addis Ababa, Ethiopia</li>
            <li>support@jmart.example</li>
            <li>+251 900 000 000</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>Built for shopping, shipping, and smooth payment flow.</p>
        <p>© 2026 JMart</p>
      </div>
    </footer>
  );
}

function HighlightCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

function StoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">{label}</p>
      <p className="mt-2 font-display text-xl font-black tracking-tight">{value}</p>
    </div>
  );
}