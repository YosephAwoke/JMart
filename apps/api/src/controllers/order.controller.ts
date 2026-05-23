import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/Order.js';
import { MOCK_PRODUCTS, type CreateOrderRequest, type ProductSummary } from '@jmart/shared';
import { createInMemoryOrder, listInMemoryOrders, findInMemoryOrder } from '../lib/inMemoryOrders.js';

function isValidShippingAddress(payload: CreateOrderRequest['shippingAddress']) {
  return Boolean(
    payload?.fullName &&
      payload.phone &&
      payload.region &&
      payload.city &&
      payload.subCity &&
      payload.woreda &&
      payload.landmark
  );
}

function buildOrderSnapshot(items: CreateOrderRequest['items']) {
  return items.map((item) => {
    const product = MOCK_PRODUCTS.find((candidate: ProductSummary) => candidate.id === item.productId || candidate.slug === item.productId);

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      title: item.title ?? product?.title ?? { en: 'Unknown item', am: 'ያልታወቀ እቃ' }
    };
  });
}

export async function listOrders(_: Request, res: Response) {
  if (mongoose.connection.readyState !== 1) {
    const orders = listInMemoryOrders();
    return res.json({ data: orders });
  }

  const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
  res.json({ data: orders });
}

export async function createOrder(req: Request, res: Response) {
  const payload = req.body as CreateOrderRequest;

  if (!payload?.items?.length || !isValidShippingAddress(payload.shippingAddress)) {
    return res.status(400).json({ message: 'Invalid order payload' });
  }

  const shippingFee = Number(payload.shippingFee ?? 0);
  const items = buildOrderSnapshot(payload.items);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0);
  const total = subtotal + shippingFee;

  const orderDoc = {
    items,
    shippingAddress: payload.shippingAddress,
    paymentProvider: payload.paymentProvider ?? 'chapa',
    paymentStatus: 'pending',
    fulfillmentStatus: 'pending',
    subtotal,
    shippingFee,
    total,
    notes: payload.notes
  };

  if (mongoose.connection.readyState !== 1) {
    const order = createInMemoryOrder(orderDoc);
    return res.status(201).json({
      data: {
        order,
        payment: {
          provider: 'chapa',
          reference: `JM-${String(order._id).slice(-8).toUpperCase()}`,
          checkoutUrl: `https://example.com/mock/chapa/checkout/${order._id}`,
          amount: total,
          currency: 'ETB'
        }
      }
    });
  }

  const order = await OrderModel.create(orderDoc);

  res.status(201).json({
    data: {
      order,
      payment: {
        provider: 'chapa',
        reference: `JM-${String(order._id).slice(-8).toUpperCase()}`,
        checkoutUrl: `https://example.com/mock/chapa/checkout/${order._id}`,
        amount: total,
        currency: 'ETB'
      }
    }
  });
}

export async function getOrder(req: Request, res: Response) {
  const idRaw = req.params.id;
  const id = Array.isArray(idRaw) ? idRaw[0] : idRaw;
  try {
    if (mongoose.connection.readyState !== 1) {
      const order = findInMemoryOrder(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json({ data: { order } });
    }

    const order = await OrderModel.findById(id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json({ data: { order } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
}