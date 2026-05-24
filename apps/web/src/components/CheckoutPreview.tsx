import { motion } from 'framer-motion';
import { mockCatalog } from '../data/mockCatalog';
import { AddisCheckoutForm } from './forms/AddisCheckoutForm';

export function CheckoutPreview() {
  const showcaseImage = mockCatalog[0]?.images[0]?.url ?? 'https://images.unsplash.com/photo-1556742400-b5fdd3e8e4d2?auto=format&fit=crop&w=1200&q=80';

  return (
    <section id="checkout" className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface/70 p-6 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Checkout</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Fast local checkout.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">A stacked visual tells the checkout story without leaving awkward empty space. The form stays focused, the preview feels premium, and the layout breathes on every screen.</p>
        </div>

        <motion.div
          className="relative mt-6 min-h-[580px] overflow-hidden rounded-[2.25rem] border border-border bg-background/60 p-5 shadow-premium"
          initial={{ y: 18, opacity: 0.85 }}
          animate={{ y: [0, -14, 0], rotateZ: [0, -1.3, 0], scale: [1, 1.015, 1], opacity: [0.96, 1, 0.96] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_36%)]" />
          <div className="absolute left-8 top-10 h-36 w-36 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute right-8 top-24 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-8 left-24 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative flex min-h-[530px] items-center justify-center">
            <div className="relative w-full max-w-[390px]">
              <motion.div
                className="relative mx-auto w-full rounded-[3rem] border border-border bg-slate-950 p-3 shadow-[0_60px_150px_rgba(0,0,0,0.32)]"
                style={{ perspective: 1400, transformStyle: 'preserve-3d' }}
                animate={{ rotateX: [8, 11, 8], rotateY: [-11, -15, -11], y: [0, -12, 0], x: [0, 6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="mx-auto flex h-7 w-36 items-center justify-center rounded-full bg-slate-800/90">
                  <div className="h-1.5 w-20 rounded-full bg-slate-600" />
                </div>

                <div className="mt-3 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900">
                    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pb-3 pt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                      <span>9:41</span>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[9px] tracking-[0.25em] text-white/70">5G</span>
                    </div>
                    <div className="absolute inset-x-1/2 top-2 z-10 h-5 w-28 -translate-x-1/2 rounded-full bg-slate-950" />
                    <img src={showcaseImage} alt="Featured product preview" className="aspect-[4/5] w-full object-cover brightness-[0.92]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.12),rgba(3,7,18,0.7)_85%)]" />

                    <div className="absolute inset-x-0 bottom-0 space-y-3 p-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-300">Ready for delivery</p>
                            <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-white">Cart to doorstep in a few taps.</h3>
                          </div>
                          <div className="rounded-[1.25rem] border border-white/15 bg-white/10 px-4 py-3 text-center shadow-sm backdrop-blur-md">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">ETB</p>
                            <p className="mt-1 font-display text-2xl font-black text-emerald-300">4.2k</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/72">Ethiopian address fields, a clear payment handoff, and a polished receipt flow.</p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <MiniCard title="Fast approval" text="Payment and order confirmation together." />
                        <MiniCard title="Live delivery" text="Clear landmark and address capture." />
                        <MiniCard title="Secure handoff" text="Mock Chapa flow with a smooth transition." />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-10 bottom-16 w-40 rounded-[1.25rem] border border-border bg-surface/90 p-3 shadow-premium backdrop-blur-xl"
                animate={{ y: [0, -7, 0], rotate: [-2, 1, -2], x: [0, 4, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Battery</p>
                <p className="mt-1 text-sm font-semibold">Ready to ship</p>
              </motion.div>

              <motion.div
                className="absolute -right-10 top-10 w-36 rounded-[1.25rem] border border-border bg-surface/90 p-3 shadow-premium backdrop-blur-xl"
                animate={{ y: [0, 8, 0], rotate: [2, -1, 2], x: [0, -4, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Motion</p>
                <p className="mt-1 text-sm font-semibold">Smooth 3D float</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <AddisCheckoutForm />
    </section>
  );
}

function Badge({ children }: { children: string }) {
  return <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">{children}</span>;
}

function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-background/90 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
    </div>
  );
}