import { Types } from 'mongoose';

type AnyObject = Record<string, any>;

const store: AnyObject[] = [];

export function createInMemoryOrder(doc: AnyObject) {
  const _id = new Types.ObjectId().toString();
  const now = new Date();
  const order = {
    _id,
    ...doc,
    createdAt: now,
    updatedAt: now
  };
  store.push(order);
  return order;
}

export function listInMemoryOrders() {
  return [...store].sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime());
}

export function findInMemoryOrder(id: string) {
  return store.find((o) => String(o._id) === String(id)) ?? null;
}

export function updateInMemoryOrder(id: string, patch: AnyObject) {
  const idx = store.findIndex((o) => String(o._id) === String(id));
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...patch, updatedAt: new Date() };
  return store[idx];
}
