import { AddisCheckoutForm } from '../components/forms/AddisCheckoutForm';
import { Link } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';

export function CheckoutPage() {
  const { items, total } = useCart();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Checkout</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">Enter your shipping details.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">The form keeps address fields clear and familiar so customers can place an order quickly.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard title="Payment" text="Secure Chapa checkout." />
          <InfoCard title="Languages" text="English and Amharic ready." />
          <InfoCard title="Delivery" text="Local address fields for Ethiopia." />
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-surfaceAlt p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Cart items</span>
            <span className="font-semibold">{items.length}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">ETB {total.toLocaleString()}</span>
          </div>
          {items.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted">
              Your cart is empty. <Link to="/catalog" className="text-accent">Choose products first</Link>.
            </div>
          ) : null}
        </div>
      </section>

      <AddisCheckoutForm />
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surfaceAlt p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}