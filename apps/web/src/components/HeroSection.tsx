import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { mockCatalog } from '../data/mockCatalog';
import { useLocale } from '../providers/LocaleProvider';

export function HeroSection() {
  const { t } = useLocale();
  const slides = useMemo(() => mockCatalog.slice(0, 3), []);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide] ?? slides[0];

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-surface p-6 shadow-premium lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.16),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.45),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent"
          >
            New arrivals now available
          </motion.span>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="max-w-2xl font-display text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
            >
              Shop everyday essentials with a premium Ethiopian storefront.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="max-w-2xl text-base leading-7 text-muted sm:text-lg"
            >
              Discover curated bags, sneakers, fragrance, and gifts with a simple browse-to-checkout flow built for real shopping.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href="#shop" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
              {t.shop}
            </motion.a>
            <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href="#checkout" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold transition hover:border-accent/40">
              {t.checkout}
            </motion.a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatBox value="ETB" label="Local currency" />
            <StatBox value="EN / AM" label="Language ready" />
            <StatBox value="Fast checkout" label="Chapa payment flow" />
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] border border-border/80 bg-background/70 p-4 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-premium"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={currentSlide.images[0]?.url}
                  alt={currentSlide.images[0]?.alt.en}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">Featured product</p>
                  <h3 className="mt-2 font-display text-2xl font-black tracking-tight">{currentSlide.title.en}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">{currentSlide.description.en}</p>
                  <p className="mt-3 text-sm font-semibold">ETB {currentSlide.price.amount.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="grid gap-4 sm:grid-cols-3">
            <FeatureBox title="Fresh drops" description="New items and best sellers surfaced first." />
            <FeatureBox title="Secure checkout" description="Clear shipping, payment, and confirmation steps." />
            <FeatureBox title="Local delivery" description="Ethiopia-first address fields and delivery notes." />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MiniMetric label="Orders" value="Ready today" />
            <MiniMetric label="Payments" value="Chapa checkout" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={[
                  'h-2.5 rounded-full transition-all',
                  activeSlide === index ? 'w-10 bg-accent' : 'w-2.5 bg-border'
                ].join(' ')}
                aria-label={`View ${slide.title.en}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBox({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surfaceAlt px-4 py-4">
      <p className="font-display text-2xl font-black tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-2 font-display text-xl font-black tracking-tight">{value}</p>
    </div>
  );
}