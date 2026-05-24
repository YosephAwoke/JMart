import { Router } from 'express';
import { productRouter } from './product.routes.js';
import { orderRouter } from './order.routes.js';
import { paymentRouter } from './payment.routes.js';
import { authRouter } from './auth.routes.js';

export const apiRouter = Router();

apiRouter.use('/products', productRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/auth', authRouter);