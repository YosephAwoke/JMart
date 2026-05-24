import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import type { AddressDraft, ThemeMode, LanguageCode } from '@jmart/shared';

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ fullName, email, phone, preferredLanguage, preferredTheme, defaultAddress });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-black">Your account</h1>
      <form onSubmit={save} className="space-y-6 rounded-2xl border border-border bg-surface p-6">
        <SectionTitle title="Profile" subtitle="Basic customer details" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={fullName} onChange={setFullName} />
          <Field label="Phone" value={phone} onChange={setPhone} />
        </div>
        <Field label="Email" value={email} onChange={setEmail} />

        <SectionTitle title="Preferences" subtitle="Store defaults and experience" />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Preferred language" value={preferredLanguage} onChange={setPreferredLanguage} options={[{ label: 'English', value: 'en' }, { label: 'Amharic', value: 'am' }]} />
          <SelectField label="Preferred theme" value={preferredTheme} onChange={setPreferredTheme} options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]} />
        </div>

        <SectionTitle title="Default delivery address" subtitle="Used to prefill checkout" />
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

        {saved ? <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">Saved.</div> : null}

        <div className="flex items-center justify-end gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-accent px-5 py-3 font-semibold text-white disabled:opacity-70">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-border px-4 py-3" />
    </label>
  );
}

function SelectField<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: Array<{ label: string; value: T }> }) {
  return (
    <label className="block text-sm">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)} className="mt-2 w-full rounded-2xl border border-border px-4 py-3">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
