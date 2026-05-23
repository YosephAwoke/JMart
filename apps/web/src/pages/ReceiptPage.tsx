import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { AddressDraft, CartItem } from '@jmart/shared';

interface ReceiptState {
  reference: string;
  checkoutUrl: string;
  amount: number;
  currency: 'ETB';
  items: Array<Pick<CartItem, 'productId' | 'title' | 'price' | 'variantLabel'>>;
  shippingAddress: AddressDraft;
  orderId?: string;
}

export function ReceiptPage() {
  const location = useLocation();
  const stored = window.sessionStorage.getItem('jmart-latest-order');
  const base = (location.state as ReceiptState | null) ?? (stored ? (JSON.parse(stored) as ReceiptState & { orderId?: string }) : null);
  const [orderState, setOrderState] = useState(base);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed' | 'unknown'>('pending');

  // Poll the API for order status when we have an orderId
  useEffect(() => {
    let mounted = true;
    if (!orderState?.orderId) return;

    const check = async () => {
      try {
        const res = await fetch(`/api/orders/${orderState.orderId}`);
        if (!res.ok) return;
        const json = await res.json();
        const ord = json?.data?.order;
        if (!ord) return;
        if (!mounted) return;
        setPaymentStatus(ord.paymentStatus ?? 'unknown');
        if (ord.paymentStatus === 'paid') {
          clearInterval(interval);
        }
      } catch (err) {
        // ignore
      }
    };

    check();
    const interval = setInterval(check, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [orderState?.orderId]);

  // Allow location.state to override stored values
  useEffect(() => {
    if (location.state) setOrderState(location.state as ReceiptState & { orderId?: string });
  }, [location.state]);

  if (!orderState) {
    return <MissingReceipt />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Order received</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">Your mock Chapa checkout is ready.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Use this receipt to review your order, open the payment link, and confirm the status update.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ReceiptStat label="Reference" value={orderState.reference} />
          <ReceiptStat label="Amount" value={`${orderState.currency} ${orderState.amount.toLocaleString()}`} />
          <ReceiptStat label="Items" value={`${orderState.items.length}`} />
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-surfaceAlt p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Payment action</p>
          <a href={orderState.checkoutUrl} className="mt-3 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
            Open mock Chapa checkout
          </a>
          <div className="mt-3">
            <p className="text-sm">Payment status: <strong className="ml-2">{paymentStatus}</strong></p>
            {orderState.orderId ? (
              <button
                onClick={async () => {
                  await fetch(`/api/payments/mock/${orderState.orderId}`, { method: 'POST' });
                }}
                className="mt-2 inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold"
              >
                Simulate payment success
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">In production, this is where a provider-hosted checkout or mobile-money redirect would begin.</p>
        </div>
      </section>

      <aside className="space-y-6 rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Shipping</p>
          <div className="mt-3 space-y-2 text-sm text-muted">
            <p>{orderState.shippingAddress.fullName}</p>
            <p>{orderState.shippingAddress.phone}</p>
            <p>{orderState.shippingAddress.region}, {orderState.shippingAddress.city}</p>
            <p>{orderState.shippingAddress.subCity}, {orderState.shippingAddress.woreda}</p>
            <p>{orderState.shippingAddress.landmark}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Order items</p>
          <div className="mt-3 space-y-3">
            {orderState.items.map((item: any) => (
              <div key={item.productId} className="rounded-2xl border border-border bg-background p-4">
                <p className="font-semibold">{item.title.en}</p>
                <p className="mt-1 text-sm text-muted">ETB {item.price.amount.toLocaleString()} · {item.variantLabel ?? 'Default'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/catalog" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">
            Continue shopping
          </Link>
          <Link to="/catalog" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
            Back to products
          </Link>
        </div>
      </aside>
    </div>
  );
}

function MissingReceipt() {
  return (
    <div className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-premium">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">No receipt found</p>
      <h1 className="mt-2 font-display text-3xl font-black tracking-tight">Complete a checkout to see the receipt.</h1>
      <p className="mt-3 text-sm leading-7 text-muted">Complete a checkout to see your order summary and payment status here.</p>
      <Link to="/checkout" className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
        Back to checkout
      </Link>
    </div>
  );
}

function ReceiptStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surfaceAlt px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">{label}</p>
      <p className="mt-2 font-display text-xl font-black tracking-tight">{value}</p>
    </div>
  );
}