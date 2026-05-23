import { motion } from 'framer-motion';
import { AddisCheckoutForm } from './forms/AddisCheckoutForm';

export function CheckoutPreview() {
  return (
    <section id="checkout" className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-surface/70 p-6 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Checkout</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Fast local checkout.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Use a simple Ethiopian address form with clear payment and delivery details, built for real orders.</p>
        </div>

        <motion.div
          className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-background/60 p-4 shadow-premium"
          initial={{ y: 10, opacity: 0.85 }}
          animate={{ y: [0, -10, 0], opacity: [0.95, 1, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="grid gap-4 md:grid-cols-[1fr_0.9fr] md:items-center">
            <img
              src="https://images.unsplash.com/photo-1556742400-b5fdd3e8e4d2?auto=format&fit=crop&w=1200&q=80"
              alt="Mobile shopping and parcel delivery"
              className="h-64 w-full rounded-[1.5rem] object-cover shadow-premium"
            />
            <div className="space-y-3 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Easy order handoff</p>
              <h3 className="font-display text-2xl font-black tracking-tight">Simple steps from cart to doorstep.</h3>
              <p className="text-sm leading-6 text-muted">Clear form fields, local delivery details, and a clean payment flow keep the checkout focused and fast.</p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <Badge>Fast approval</Badge>
                <Badge>Local delivery</Badge>
                <Badge>Order tracking</Badge>
              </div>
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