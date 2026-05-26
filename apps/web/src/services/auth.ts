import type { AuthResponse, UserProfile } from '@jmart/shared';

async function readResponseBody<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text);
  }
}

async function readErrorMessage(res: Response, fallback: string) {
  const body = await readResponseBody<{ message?: string }>(res);
  return body?.message || fallback;
}

export async function register(payload: { fullName: string; email?: string; phone: string; password: string }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Registration failed'));
  const data = await readResponseBody<{ data: { user: UserProfile; token: string } }>(res);
  if (!data) throw new Error('Registration failed: empty response from server');
  return data;
}

export async function login(payload: { phone: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Login failed'));
  const data = await readResponseBody<{ data: { user: UserProfile; token: string } }>(res);
  if (!data) throw new Error('Login failed: empty response from server');
  return data;
}

export async function me(token: string) {
  const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Not authenticated');
  const data = await readResponseBody<{ data: { user: UserProfile } }>(res);
  if (!data) throw new Error('Not authenticated');
  return data;
}

export async function updateProfile(token: string, patch: Partial<UserProfile>) {
  const res = await fetch('/api/auth/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch)
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Update failed'));
  const data = await readResponseBody<{ data: { user: UserProfile } }>(res);
  if (!data) throw new Error('Update failed: empty response from server');
  return data;
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
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Could not request reset'));
  const data = await readResponseBody<{ data: { ok: boolean; resetToken: string } }>(res);
  if (!data) throw new Error('Could not request reset: empty response from server');
  return data;
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Could not reset password'));
  const data = await readResponseBody<{ data: { ok: boolean } }>(res);
  if (!data) throw new Error('Could not reset password: empty response from server');
  return data;
}

export async function changePassword(token: string, payload: { currentPassword: string; newPassword: string }) {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Could not change password'));
  const data = await readResponseBody<{ data: { ok: boolean } }>(res);
  if (!data) throw new Error('Could not change password: empty response from server');
  return data;
}
