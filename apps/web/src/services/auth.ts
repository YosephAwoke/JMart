import type { AuthResponse, UserProfile } from '@jmart/shared';

export async function register(payload: { fullName: string; email?: string; phone: string; password: string }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return (await res.json()) as { data: { user: UserProfile; token: string } };
}

export async function login(payload: { phone: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return (await res.json()) as { data: { user: UserProfile; token: string } };
}

export async function me(token: string) {
  const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Not authenticated');
  return (await res.json()) as { data: { user: UserProfile } };
}

export async function updateProfile(token: string, patch: Partial<UserProfile>) {
  const res = await fetch('/api/auth/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
  return (await res.json()) as { data: { user: UserProfile } };
}
