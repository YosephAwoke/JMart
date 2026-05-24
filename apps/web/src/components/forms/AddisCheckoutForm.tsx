import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  type AddressDraft,
  ADDIS_ABABA_SUB_CITIES,
  ETHIOPIAN_REGIONS,
  type CartItem,
  type CreateOrderRequest
} from '@jmart/shared';
import { useCart } from '../../providers/CartProvider';
import { useAuth } from '../../providers/AuthProvider';
import { inputFieldClass, selectFieldClass } from './inputStyles';
import { createOrder } from '../../services/orders';

export function AddisCheckoutForm() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [form, setForm] = useState<AddressDraft>({
    fullName: '',
    phone: '',
    region: ETHIOPIAN_REGIONS[0] ?? 'Addis Ababa',
    city: 'Addis Ababa',
    subCity: ADDIS_ABABA_SUB_CITIES[0] ?? 'Bole',
    woreda: '',
    kebele: '',
    landmark: '',
    building: '',
    notes: ''
  });

  const { user, updateProfile } = useAuth();
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  useEffect(() => {
    if (user?.defaultAddress) {
      setForm((current) => ({ ...current, ...(user.defaultAddress as Partial<AddressDraft>) }));
    }
  }, [user]);

  const orderItems = useMemo(() => items.map(toOrderItem), [items]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setStatus('error');
      setMessage('Add at least one item before checkout.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    setCheckoutUrl('');

    try {
      const response = await createOrder({
        items: orderItems,
        shippingAddress: form,
        notes: form.notes,
        shippingFee: 0,
        paymentProvider: 'chapa'
      } satisfies CreateOrderRequest);

      clearCart();
      if (saveAsDefault && user) {
        try {
          await updateProfile({ defaultAddress: form as any });
        } catch (_) {
          // ignore profile save errors for now
        }
      }
      setStatus('success');
      setCheckoutUrl(response.data.payment.checkoutUrl);
      setMessage(`Order ${response.data.payment.reference} created successfully.`);
      window.sessionStorage.setItem(
        'jmart-latest-order',
        JSON.stringify({
          orderId: (response.data.order as any)?._id ?? response.data.order?.id,
          reference: response.data.payment.reference,
          checkoutUrl: response.data.payment.checkoutUrl,
          amount: response.data.payment.amount,
          currency: response.data.payment.currency,
          items: orderItems,
          shippingAddress: form
        })
      );
      navigate('/checkout/success');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not create your order.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm">
      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Items</span>
          <span className="font-semibold">{items.length}</span>
        </div>
        <div className="mt-3 space-y-3">
          {items.length === 0 ? <p className="text-sm text-muted">Your cart is empty. Browse the catalog to continue.</p> : null}
          {items.map((item) => (
            <CheckoutLineItem key={item.productId} item={item} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted">Estimated total</span>
          <span className="font-display text-2xl font-black text-accent">ETB {total.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
        <Field label="Phone number" placeholder="+251" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Region" select options={ETHIOPIAN_REGIONS as unknown as string[]} value={form.region} onChange={(value) => setForm((current) => ({ ...current, region: value }))} />
        <Field label="City" placeholder="Addis Ababa" value={form.city} onChange={(value) => setForm((current) => ({ ...current, city: value }))} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sub-city" select options={ADDIS_ABABA_SUB_CITIES as unknown as string[]} value={form.subCity} onChange={(value) => setForm((current) => ({ ...current, subCity: value }))} />
        <Field label="Woreda" placeholder="Woreda 05" value={form.woreda} onChange={(value) => setForm((current) => ({ ...current, woreda: value }))} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Landmark / Sefer" placeholder="Near Atlas Hotel" value={form.landmark} onChange={(value) => setForm((current) => ({ ...current, landmark: value }))} />
        <Field label="Building / House" placeholder="Block 12, Unit 3" value={form.building ?? ''} onChange={(value) => setForm((current) => ({ ...current, building: value }))} />
      </div>

      <Field label="Delivery notes" textarea placeholder="Call on arrival or leave with security." value={form.notes ?? ''} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />

      {message ? (
        <div className={['rounded-2xl border px-4 py-3 text-sm', status === 'error' ? 'border-red-400/40 bg-red-500/5 text-red-700' : 'border-accent/30 bg-accent/5 text-foreground'].join(' ')}>
          {message}
          {checkoutUrl ? (
            <p className="mt-2">
              <a href={checkoutUrl} className="font-semibold text-accent underline-offset-4 hover:underline">
                Open mock Chapa checkout
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      <button type="submit" disabled={status === 'submitting'} className="w-full rounded-full bg-accent px-4 py-3 font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-70">
        {status === 'submitting' ? 'Creating order...' : 'Continue to payment'}
      </button>

      <label className="mt-2 flex items-center gap-3 text-sm">
        <input type="checkbox" checked={saveAsDefault} onChange={(e) => setSaveAsDefault(e.target.checked)} />
        <span>Save this address as my default</span>
      </label>

      <p className="text-xs leading-6 text-muted">
        Prefer to keep shopping? <Link to="/catalog" className="text-accent">Browse the catalog</Link>.
      </p>
    </form>
  );
}

function Field({
  label,
  placeholder,
  select,
  textarea,
  options = [],
  value,
  onChange
}: {
  label: string;
  placeholder?: string;
  select?: boolean;
  textarea?: boolean;
  options?: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      <span>{label}</span>
      {select ? (
        <select className={selectFieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea rows={4} className={inputFieldClass} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputFieldClass} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function CheckoutLineItem({ item }: { item: CartItem }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
      <img src={item.image} alt={item.title.en} className="h-14 w-14 rounded-xl object-cover" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{item.title.en}</p>
        <p className="text-xs text-muted">Qty {item.quantity}</p>
      </div>
      <p className="text-sm font-semibold">ETB {(item.price.amount * item.quantity).toLocaleString()}</p>
    </div>
  );
}

function toOrderItem(item: CartItem) {
  return {
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.price,
    title: item.title,
    variantLabel: item.variantLabel
  };
}