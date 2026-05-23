import type { CreateOrderRequest, CreateOrderResponse } from '@jmart/shared';

export async function createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(error.message ?? 'Unable to create order');
  }

  return (await response.json()) as CreateOrderResponse;
}