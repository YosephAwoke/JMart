import { AddisCheckoutForm } from './forms/AddisCheckoutForm';

export function CheckoutPreview() {
  return (
    <section id="checkout" className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Checkout</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Fast local checkout.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Use a simple Ethiopian address form with clear payment and delivery details, built for real orders.</p>
      </div>
      <AddisCheckoutForm />
    </section>
  );
}