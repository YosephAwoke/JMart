import type { AddressDraft, LocalizedText } from './types.js';

export interface OrderItemDraft {
  productId: string;
  quantity: number;
  unitPrice: { amount: number; currency: 'ETB' };
  title: LocalizedText;
  variantLabel?: string;
}

export interface CreateOrderRequest {
  customerId?: string;
  items: OrderItemDraft[];
  shippingAddress: AddressDraft;
  paymentProvider?: 'chapa' | 'cod' | 'bank_transfer';
  shippingFee?: number;
  notes?: string;
}

export interface CreateOrderResponse {
  data: {
    order: {
      id: string;
      items: OrderItemDraft[];
      subtotal: number;
      shippingFee: number;
      total: number;
      paymentProvider: 'chapa' | 'cod' | 'bank_transfer';
      paymentStatus: 'pending' | 'paid' | 'failed';
      fulfillmentStatus: 'pending' | 'processing' | 'fulfilled';
    };
    payment: {
      provider: 'chapa';
      reference: string;
      checkoutUrl: string;
      amount: number;
      currency: 'ETB';
    };
  };
}