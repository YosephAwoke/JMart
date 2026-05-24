import { Types } from 'mongoose';

type AnyObject = Record<string, any>;

const store: AnyObject[] = [];

export function createInMemoryUser(doc: AnyObject) {
  const _id = new Types.ObjectId().toString();
  const now = new Date();
  const user = { _id, ...doc, createdAt: now, updatedAt: now };
  store.push(user);
  return user;
}

export function listInMemoryUsers() {
  return [...store].sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}

export function findInMemoryUser(predicate: (u: AnyObject) => boolean) {
  return store.find((u) => predicate(u)) ?? null;
}

export function findInMemoryUserById(id: string) {
  return store.find((u) => String(u._id) === String(id)) ?? null;
}

export function updateInMemoryUser(id: string, patch: AnyObject) {
  const idx = store.findIndex((u) => String(u._id) === String(id));
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...patch, updatedAt: new Date() };
  return store[idx];
}

export function addFavoriteInMemory(id: string, productId: string) {
  const user = findInMemoryUserById(id);
  if (!user) return null;
  user.favorites = Array.isArray(user.favorites) ? user.favorites : [];
  if (!user.favorites.includes(productId)) user.favorites.push(productId);
  user.updatedAt = new Date();
  return user;
}

export function removeFavoriteInMemory(id: string, productId: string) {
  const user = findInMemoryUserById(id);
  if (!user) return null;
  user.favorites = (user.favorites || []).filter((p: string) => p !== productId);
  user.updatedAt = new Date();
  return user;
}
