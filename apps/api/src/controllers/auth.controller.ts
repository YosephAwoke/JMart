import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';
import { createInMemoryUser, findInMemoryUser, findInMemoryUserById } from '../lib/inMemoryUsers.js';
import { addFavoriteInMemory, removeFavoriteInMemory } from '../lib/inMemoryUsers.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export async function register(req: Request, res: Response) {
  const { fullName, email, phone, password, preferredLanguage, preferredTheme } = req.body;
  if (!fullName || !phone || !password) return res.status(400).json({ message: 'Missing required fields' });

  const passwordHash = await bcrypt.hash(password, 10);

  if (mongoose.connection.readyState !== 1) {
    const user = createInMemoryUser({ fullName, email, phone, passwordHash, preferredLanguage, preferredTheme });
    const token = jwt.sign({ sub: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ data: { user, token } });
  }

  try {
    const user = await UserModel.create({ fullName, email, phone, passwordHash, preferredLanguage, preferredTheme });
    const token = jwt.sign({ sub: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ data: { user, token } });
  } catch (err) {
    res.status(500).json({ message: 'Could not create user' });
  }
}

export async function login(req: Request, res: Response) {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ message: 'Missing phone or password' });

  if (mongoose.connection.readyState !== 1) {
    const user = findInMemoryUser((u) => u.phone === phone || u.email === phone);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ sub: String(user._id) }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ data: { user, token } });
  }

  const user = await UserModel.findOne({ $or: [{ phone }, { email: phone }] }).lean();
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, (user as any).passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: String((user as any)._id) }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ data: { user, token } });
}

export async function me(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const id = decoded.sub;
    if (mongoose.connection.readyState !== 1) {
      const user = findInMemoryUserById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ data: { user } });
    }
    const user = await UserModel.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: { user } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const id = decoded.sub;
    const patch = req.body;
    if (mongoose.connection.readyState !== 1) {
      const updated = (await import('../lib/inMemoryUsers.js')).updateInMemoryUser(id, patch);
      if (!updated) return res.status(404).json({ message: 'User not found' });
      return res.json({ data: { user: updated } });
    }
    const user = await UserModel.findByIdAndUpdate(id, patch, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: { user } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function listFavorites(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const id = decoded.sub;
    if (mongoose.connection.readyState !== 1) {
      const user = findInMemoryUserById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ data: { favorites: user.favorites || [] } });
    }
    const user = await UserModel.findById(id).select('favorites').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: { favorites: user.favorites || [] } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function addFavorite(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const id = decoded.sub;
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ message: 'Missing productId' });
    if (mongoose.connection.readyState !== 1) {
      const updated = addFavoriteInMemory(id, productId);
      if (!updated) return res.status(404).json({ message: 'User not found' });
      return res.json({ data: { favorites: updated.favorites || [] } });
    }
    const user = await UserModel.findByIdAndUpdate(id, { $addToSet: { favorites: productId } }, { new: true }).select('favorites').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: { favorites: user.favorites || [] } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function removeFavorite(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const id = decoded.sub;
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ message: 'Missing productId' });
    if (mongoose.connection.readyState !== 1) {
      const updated = removeFavoriteInMemory(id, productId);
      if (!updated) return res.status(404).json({ message: 'User not found' });
      return res.json({ data: { favorites: updated.favorites || [] } });
    }
    const user = await UserModel.findByIdAndUpdate(id, { $pull: { favorites: productId } }, { new: true }).select('favorites').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: { favorites: user.favorites || [] } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
