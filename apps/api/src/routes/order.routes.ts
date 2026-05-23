import { Router } from 'express';
import { createOrder, listOrders, getOrder } from '../controllers/order.controller.js';

export const orderRouter = Router();

orderRouter.get('/', listOrders);
orderRouter.get('/:id', getOrder);
orderRouter.post('/', createOrder);