import { Router } from 'express';
import { listProducts, getProductBySlug } from '../controllers/product.controller.js';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.get('/:slug', getProductBySlug);