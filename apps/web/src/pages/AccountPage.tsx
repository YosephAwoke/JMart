import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import type { AddressDraft, ThemeMode, LanguageCode } from '@jmart/shared';
import { inputFieldClass, selectFieldClass } from '../components/forms/inputStyles';
import * as authService from '../services/auth';

type PanelId = 'account' | 'password' | 'address' | 'orders' | 'location';

type OrderRow = {
  _id: string;
  createdAt?: string;
  total?: number;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  shippingAddress?: { fullName?: string; phone?: string; city?: string };
  items?: Array<unknown>;
};

const sidebarItems: Array<{ id: PanelId; title: string; description: string }> = [
  { id: 'account', title: 'Account info', description: 'Name, email, phone, language, and theme.' },
  { id: 'password', title: 'Change password', description: 'Update your login password securely.' },
  { id: 'address', title: 'Change address', description: 'Edit your delivery address and notes.' },
  { id: 'orders', title: 'Order history', description: 'View recent checkout activity.' },
  { id: 'location', title: 'Change location', description: 'Tune the delivery area and landmark.' }
];

export default function AccountPage() {
  const { user, token, updateProfile } = useAuth();
  const [activePanel, setActivePanel] = useState<PanelId>('account');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(user?.preferredLanguage || 'en');
  const [preferredTheme, setPreferredTheme] = useState<ThemeMode>(user?.preferredTheme || 'light');
  const [defaultAddress, setDefaultAddress] = useState<AddressDraft>({
    fullName: user?.defaultAddress?.fullName ?? user?.fullName ?? '',
    phone: user?.defaultAddress?.phone ?? user?.phone ?? '',
    region: user?.defaultAddress?.region ?? 'Addis Ababa',
    city: user?.defaultAddress?.city ?? 'Addis Ababa',
    subCity: user?.defaultAddress?.subCity ?? 'Bole',
    woreda: user?.defaultAddress?.woreda ?? '',
    kebele: user?.defaultAddress?.kebele ?? '',
    landmark: user?.defaultAddress?.landmark ?? '',
    building: user?.defaultAddress?.building ?? '',
    notes: user?.defaultAddress?.notes ?? ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [orderRows, setOrderRows] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || '');
    setEmail(user.email || '');
    setPhone(user.phone || '');
    setPreferredLanguage(user.preferredLanguage || 'en');
    setPreferredTheme(user.preferredTheme || 'light');
    setDefaultAddress({
      fullName: user.defaultAddress?.fullName ?? user.fullName ?? '',
      phone: user.defaultAddress?.phone ?? user.phone ?? '',
      region: user.defaultAddress?.region ?? 'Addis Ababa',
      city: user.defaultAddress?.city ?? 'Addis Ababa',
      subCity: user.defaultAddress?.subCity ?? 'Bole',
      woreda: user.defaultAddress?.woreda ?? '',
      kebele: user.defaultAddress?.kebele ?? '',
      landmark: user.defaultAddress?.landmark ?? '',
      building: user.defaultAddress?.building ?? '',
      notes: user.defaultAddress?.notes ?? ''
    });
  }, [user]);

  useEffect(() => {
    let mounted = true;
    async function loadOrders() {
      setOrdersLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: OrderRow[] };
        if (!mounted) return;
        setOrderRows(payload.data ?? []);
      } catch {
        if (mounted) setOrderRows([]);
      } finally {
        if (mounted) setOrdersLoading(false);
      }
    }
    loadOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (!user) return [];
    return orderRows.filter((order) => {
      const fullName = order.shippingAddress?.fullName?.toLowerCase?.() ?? '';
      const phoneNumber = order.shippingAddress?.phone ?? '';
      return fullName.includes(user.fullName.toLowerCase()) || phoneNumber === user.phone;
    });
  }, [orderRows, user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      await updateProfile({ fullName, email, phone, preferredLanguage, preferredTheme, defaultAddress });
      setProfileSaved(true);
      window.setTimeout(() => setProfileSaved(false), 1500);
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage('');
    if (!token) return;
    if (newPassword.length < 6) {
      setPasswordMessage('New password should be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }
    setPasswordBusy(true);
    try {
      await authService.changePassword(token, { currentPassword, newPassword });
      setPasswordMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : 'Could not change password.');
    } finally {
      setPasswordBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-premium">
        <p className="text-sm text-muted">Please sign in to manage your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Account</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">Manage your profile, orders, and delivery settings.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">Use the sidebar to jump between account info, password, address, order history, and delivery location. This mirrors the dashboard style used by polished ecommerce storefronts.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium">
          <div className="rounded-3xl border border-border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Signed in as</p>
            <p className="mt-2 font-display text-2xl font-bold">{user.fullName}</p>
            <p className="mt-1 text-sm text-muted">{user.email || user.phone}</p>
          </div>

          <div className="mt-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePanel(item.id)}
                className={['w-full rounded-2xl border px-4 py-3 text-left transition', activePanel === item.id ? 'border-accent bg-accent text-white shadow-glow' : 'border-border bg-surfaceAlt hover:border-accent/40'].join(' ')}
              >
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className={['mt-1 block text-xs leading-5', activePanel === item.id ? 'text-white/80' : 'text-muted'].join(' ')}>{item.description}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
          {activePanel === 'account' ? (
            <form onSubmit={saveProfile} className="space-y-6">
              <PanelHeader title="Account information" subtitle="Edit your name, phone, email, language, and theme." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={fullName} onChange={setFullName} />
                <Field label="Phone" value={phone} onChange={setPhone} />
              </div>
              <Field label="Email" value={email} onChange={setEmail} />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Preferred language" value={preferredLanguage} onChange={setPreferredLanguage} options={[{ label: 'English', value: 'en' }, { label: 'Amharic', value: 'am' }]} />
                <SelectField label="Preferred theme" value={preferredTheme} onChange={setPreferredTheme} options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]} />
              </div>

              {profileSaved ? <StatusBox tone="success" text="Profile saved." /> : null}

              <div className="flex justify-end">
                <button type="submit" disabled={savingProfile} className="rounded-full bg-accent px-5 py-3 font-semibold text-white disabled:opacity-70">
                  {savingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : null}

          {activePanel === 'password' ? (
            <form onSubmit={savePassword} className="space-y-6">
              <PanelHeader title="Change password" subtitle="Set a new password after confirming your current one." />
              <Field label="Current password" value={currentPassword} onChange={setCurrentPassword} type="password" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New password" value={newPassword} onChange={setNewPassword} type="password" />
                <Field label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
              </div>
              {passwordMessage ? <StatusBox tone={passwordMessage.includes('success') ? 'success' : 'neutral'} text={passwordMessage} /> : null}
              <div className="flex justify-end">
                <button type="submit" disabled={passwordBusy} className="rounded-full bg-accent px-5 py-3 font-semibold text-white disabled:opacity-70">
                  {passwordBusy ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          ) : null}

          {activePanel === 'address' ? (
            <form onSubmit={saveProfile} className="space-y-6">
              <PanelHeader title="Change address" subtitle="Update the delivery address used at checkout." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Recipient name" value={defaultAddress.fullName} onChange={(value) => setDefaultAddress((current) => ({ ...current, fullName: value }))} />
                <Field label="Recipient phone" value={defaultAddress.phone} onChange={(value) => setDefaultAddress((current) => ({ ...current, phone: value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Region" value={defaultAddress.region} onChange={(value) => setDefaultAddress((current) => ({ ...current, region: value }))} />
                <Field label="City" value={defaultAddress.city} onChange={(value) => setDefaultAddress((current) => ({ ...current, city: value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sub-city" value={defaultAddress.subCity} onChange={(value) => setDefaultAddress((current) => ({ ...current, subCity: value }))} />
                <Field label="Woreda" value={defaultAddress.woreda} onChange={(value) => setDefaultAddress((current) => ({ ...current, woreda: value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Landmark" value={defaultAddress.landmark} onChange={(value) => setDefaultAddress((current) => ({ ...current, landmark: value }))} />
                <Field label="Building / House" value={defaultAddress.building ?? ''} onChange={(value) => setDefaultAddress((current) => ({ ...current, building: value }))} />
              </div>
              <Field label="Notes" value={defaultAddress.notes ?? ''} onChange={(value) => setDefaultAddress((current) => ({ ...current, notes: value }))} />
              <div className="flex justify-end">
                <button type="submit" className="rounded-full bg-accent px-5 py-3 font-semibold text-white">Save address</button>
              </div>
            </form>
          ) : null}

          {activePanel === 'orders' ? (
            <div className="space-y-6">
              <PanelHeader title="Order history" subtitle="Track recent purchases and see how each order moved through checkout." />
              {ordersLoading ? <StatusBox tone="neutral" text="Loading orders..." /> : null}
              {!ordersLoading && filteredOrders.length === 0 ? <StatusBox tone="neutral" text="No matching orders found yet." /> : null}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={String(order._id)} className="rounded-3xl border border-border bg-background p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">Order #{String(order._id).slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-muted">{order.shippingAddress?.city} · {new Date(order.createdAt ?? Date.now()).toLocaleDateString()}</p>
                      </div>
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{order.paymentStatus ?? 'pending'}</span>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <Meta value={`ETB ${Number(order.total ?? 0).toLocaleString()}`} label="Total" />
                      <Meta value={`${order.items?.length ?? 0} items`} label="Items" />
                      <Meta value={order.fulfillmentStatus ?? 'pending'} label="Fulfillment" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === 'location' ? (
            <form onSubmit={saveProfile} className="space-y-6">
              <PanelHeader title="Change location" subtitle="Tune the delivery area used for estimates and checkout defaults." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Region" value={defaultAddress.region} onChange={(value) => setDefaultAddress((current) => ({ ...current, region: value }))} />
                <Field label="City" value={defaultAddress.city} onChange={(value) => setDefaultAddress((current) => ({ ...current, city: value }))} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sub-city" value={defaultAddress.subCity} onChange={(value) => setDefaultAddress((current) => ({ ...current, subCity: value }))} />
                <Field label="Landmark" value={defaultAddress.landmark} onChange={(value) => setDefaultAddress((current) => ({ ...current, landmark: value }))} />
              </div>
              <Field label="Extra notes" value={defaultAddress.notes ?? ''} onChange={(value) => setDefaultAddress((current) => ({ ...current, notes: value }))} />
              <div className="flex justify-end">
                <button type="submit" className="rounded-full bg-accent px-5 py-3 font-semibold text-white">Save location</button>
              </div>
            </form>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function PanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{subtitle}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={inputFieldClass} />
    </label>
  );
}

function SelectField<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: Array<{ label: string; value: T }> }) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)} className={selectFieldClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBox({ tone, text }: { tone: 'success' | 'neutral'; text: string }) {
  return <div className={['rounded-2xl px-4 py-3 text-sm', tone === 'success' ? 'border border-green-500/30 bg-green-500/10 text-green-700' : 'border border-border bg-surfaceAlt text-muted'].join(' ')}>{text}</div>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}
