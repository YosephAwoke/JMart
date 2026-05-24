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

export async function getFavorites(token: string) {
  const res = await fetch('/api/auth/favorites', { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Could not fetch favorites');
  return (await res.json()) as { data: { favorites: string[] } };
}

export async function addFavorite(token: string, productId: string) {
  const res = await fetch(`/api/auth/favorites/${encodeURIComponent(productId)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Could not add favorite');
  return (await res.json()) as { data: { favorites: string[] } };
}

export async function removeFavorite(token: string, productId: string) {
  const res = await fetch(`/api/auth/favorites/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Could not remove favorite');
  return (await res.json()) as { data: { favorites: string[] } };
}

export async function forgotPassword(identifier: string) {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Could not request reset');
  return (await res.json()) as { data: { ok: boolean; resetToken: string } };
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Could not reset password');
  return (await res.json()) as { data: { ok: boolean } };
}
