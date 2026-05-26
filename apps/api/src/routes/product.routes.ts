import { Router } from 'express';
import { listProducts, getProductBySlug, listProductComments, addProductComment } from '../controllers/product.controller.js';

export const productRouter = Router();

productRouter.get('/', listProducts);
productRouter.get('/:slug', getProductBySlug);
productRouter.get('/:slug/comments', listProductComments);
productRouter.post('/:slug/comments', addProductComment);