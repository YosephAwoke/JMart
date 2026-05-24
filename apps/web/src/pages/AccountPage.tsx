import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ fullName, email, phone });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-black">Your account</h1>
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="block text-sm">
          <span>Full name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-2xl border border-border px-4 py-3" />
        </label>
        <label className="block text-sm">
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-border px-4 py-3" />
        </label>
        <label className="block text-sm">
          <span>Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-2xl border border-border px-4 py-3" />
        </label>
        <button disabled={saving} className="w-full rounded-full bg-accent px-4 py-3 font-semibold text-white">{saving ? 'Saving...' : 'Save changes'}</button>
      </form>
    </div>
  );
}
