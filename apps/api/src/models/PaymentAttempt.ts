import { Schema, model } from 'mongoose';

const paymentAttemptSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    provider: { type: String, default: 'chapa' },
    providerRef: String,
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    payload: Schema.Types.Mixed,
    webhookPayload: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const PaymentAttemptModel = model('PaymentAttempt', paymentAttemptSchema);