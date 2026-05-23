import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/Order.js';
import { updateInMemoryOrder, findInMemoryOrder } from '../lib/inMemoryOrders.js';

export async function createPaymentIntent(req: Request, res: Response) {
  const { orderId, amount } = req.body;

  res.status(201).json({
    data: {
      provider: 'chapa',
      orderId,
      amount,
      checkoutUrl: `https://example.com/mock/chapa/checkout/${orderId}`
    }
  });
}

export async function verifyWebhook(req: Request, res: Response) {
  const payload = req.body as { reference?: string; status?: string; orderId?: string };

  try {
    // If the provider sends an orderId, prefer it. Otherwise try to match by reference.
    if (mongoose.connection.readyState !== 1) {
      const id = payload.orderId;
      const order = id ? findInMemoryOrder(id) : null;
      if (!order) return res.status(404).json({ received: false, message: 'order not found' });
      if (payload.status === 'paid' || payload.status === 'success') {
        updateInMemoryOrder(order._id, { paymentStatus: 'paid' });
      }
      return res.json({ received: true, provider: 'chapa' });
    }

    const query = payload.orderId ? { _id: payload.orderId } : { 'payment.reference': payload.reference };
    const order = await OrderModel.findOne(query as any);
    if (!order) return res.status(404).json({ received: false, message: 'order not found' });

    if (payload.status === 'paid' || payload.status === 'success') {
      order.paymentStatus = 'paid';
      await order.save();
    }

    return res.json({ received: true, provider: 'chapa' });
  } catch (err) {
    return res.status(500).json({ received: false });
  }
}

export async function createMockPayment(req: Request, res: Response) {
  const orderIdRaw = req.params.orderId;
  const orderId = Array.isArray(orderIdRaw) ? orderIdRaw[0] : orderIdRaw;
  try {
    if (mongoose.connection.readyState !== 1) {
      const order = findInMemoryOrder(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      updateInMemoryOrder(orderId, { paymentStatus: 'paid' });
      return res.json({ ok: true, orderId });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.paymentStatus = 'paid';
    await order.save();
    return res.json({ ok: true, orderId });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
}