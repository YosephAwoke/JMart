import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ProductModel } from '../models/Product.js';
import { MOCK_PRODUCTS, type ProductComment, type ProductSummary } from '@jmart/shared';
import { addInMemoryComment, listInMemoryComments } from '../lib/inMemoryProductComments.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export async function listProducts(_: Request, res: Response) {
  try {
    const products = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json({ data: products.length > 0 ? products : MOCK_PRODUCTS });
  } catch {
    res.json({ data: MOCK_PRODUCTS });
  }
}

export async function getProductBySlug(req: Request, res: Response) {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug }).lean();
    const fallback = MOCK_PRODUCTS.find((item: ProductSummary) => item.slug === req.params.slug);

    if (!product && !fallback) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const withComments = await attachComments(product ?? fallback);
    res.json({ data: withComments });
  } catch {
    const fallback = MOCK_PRODUCTS.find((item: ProductSummary) => item.slug === req.params.slug);
    if (!fallback) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const withComments = await attachComments(fallback);
    res.json({ data: withComments });
  }
}

export async function listProductComments(req: Request, res: Response) {
  const slug = req.params.slug;
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await ProductModel.findOne({ slug }).select('comments').lean();
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json({ data: product.comments ?? [] });
    }

    const fallback = MOCK_PRODUCTS.find((item) => item.slug === slug);
    if (!fallback) return res.status(404).json({ message: 'Product not found' });
    return res.json({ data: listInMemoryComments(fallback.id) });
  } catch {
    return res.status(500).json({ message: 'Could not load comments' });
  }
}

export async function addProductComment(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const { text } = req.body as { text?: string };
  if (!text?.trim()) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const userId = decoded.sub;
    const slug = req.params.slug;
    const authorName = req.body.authorName?.trim() || 'Verified customer';

    if (mongoose.connection.readyState === 1) {
      const product = await ProductModel.findOne({ slug });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      const comment: ProductComment = {
        id: new mongoose.Types.ObjectId().toString(),
        userId,
        authorName,
        text: text.trim(),
        createdAt: new Date().toISOString()
      };
      product.set('comments', [comment, ...(product.comments ?? [])]);
      await product.save();
      return res.status(201).json({ data: comment });
    }

    const fallback = MOCK_PRODUCTS.find((item) => item.slug === slug);
    if (!fallback) return res.status(404).json({ message: 'Product not found' });
    const comment = addInMemoryComment(fallback.id, authorName, userId, text.trim());
    return res.status(201).json({ data: comment });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function attachComments(product: any) {
  if (!product) return product;
  const comments = await getCommentsForProduct(product);
  return { ...product, comments };
}

async function getCommentsForProduct(product: any) {
  if (!product) return [];
  if (mongoose.connection.readyState === 1) {
    if (Array.isArray(product.comments)) return product.comments;
    const doc = await ProductModel.findOne({ slug: product.slug }).select('comments').lean();
    return doc?.comments ?? [];
  }
  const fallback = MOCK_PRODUCTS.find((item) => item.slug === product.slug);
  if (!fallback) return [];
  return listInMemoryComments(fallback.id);
}