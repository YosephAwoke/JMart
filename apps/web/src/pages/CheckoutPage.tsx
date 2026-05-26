import { AddisCheckoutForm } from '../components/forms/AddisCheckoutForm';
import { Link } from 'react-router-dom';
import { useCart } from '../providers/CartProvider';

export function CheckoutPage() {
  const { items, total, removeItem, setItemQuantity } = useCart();

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
          <div className="mt-4 space-y-3">
            {items.map((item) => {
              const cartKey = item.cartKey ?? item.productId;
              return (
              <div key={cartKey} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-3">
                <img src={item.image} alt={item.title.en} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.title.en}</p>
                  {item.variantLabel ? <p className="text-xs text-muted">{item.variantLabel}</p> : null}
                  <p className="text-sm text-muted">ETB {(item.price.amount * item.quantity).toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <QtyButton onClick={() => setItemQuantity(cartKey, item.quantity - 1)}>-</QtyButton>
                    <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <QtyButton onClick={() => setItemQuantity(cartKey, item.quantity + 1)}>+</QtyButton>
                    <button className="ml-2 text-sm text-accent" onClick={() => removeItem(cartKey)}>Remove</button>
                  </div>
                </div>
              </div>
              );
            })}
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

function QtyButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold hover:border-accent hover:text-accent">
      {children}
    </button>
  );
}