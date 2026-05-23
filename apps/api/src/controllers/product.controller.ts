import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { MOCK_PRODUCTS, type ProductSummary } from '@jmart/shared';

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

    res.json({ data: product ?? fallback });
  } catch {
    const fallback = MOCK_PRODUCTS.find((item: ProductSummary) => item.slug === req.params.slug);
    if (!fallback) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ data: fallback });
  }
}