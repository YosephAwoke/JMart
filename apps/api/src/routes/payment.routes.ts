import { Router } from 'express';
import { createPaymentIntent, verifyWebhook, createMockPayment } from '../controllers/payment.controller.js';

export const paymentRouter = Router();

paymentRouter.post('/intent', createPaymentIntent);
paymentRouter.post('/webhook/chapa', verifyWebhook);
paymentRouter.post('/mock/:orderId', createMockPayment);