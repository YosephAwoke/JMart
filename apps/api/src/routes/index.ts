import { Router } from 'express';
import { productRouter } from './product.routes.js';
import { orderRouter } from './order.routes.js';
import { paymentRouter } from './payment.routes.js';

export const apiRouter = Router();

apiRouter.use('/products', productRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/payments', paymentRouter);