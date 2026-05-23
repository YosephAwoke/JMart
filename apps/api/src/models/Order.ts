import { Schema, model } from 'mongoose';

const addressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    subCity: { type: String, required: true },
    woreda: { type: String, required: true },
    kebele: String,
    landmark: { type: String, required: true },
    building: String,
    notes: String
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        unitPrice: { amount: Number, currency: String },
        title: { en: String, am: String },
        variantLabel: String
      }
    ],
    shippingAddress: { type: addressSchema, required: true },
    paymentProvider: { type: String, default: 'chapa' },
    paymentStatus: { type: String, default: 'pending' },
    fulfillmentStatus: { type: String, default: 'pending' },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: String
  },
  { timestamps: true }
);

export const OrderModel = model('Order', orderSchema);