import { Schema, model } from 'mongoose';

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true },
    am: { type: String, required: true }
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },
    category: { type: String, required: true, index: true },
    price: { amount: { type: Number, required: true }, currency: { type: String, default: 'ETB' } },
    compareAtPrice: { amount: Number, currency: String },
    stock: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: localizedTextSchema, required: true }
      }
    ],
    variants: [
      {
        name: { type: localizedTextSchema, required: true },
        value: { type: String, required: true },
        sku: String,
        stock: { type: Number, default: 0 }
      }
    ],
    tags: [{ type: String }],
    brand: String,
    vendor: String,
    companyDescription: { type: localizedTextSchema },
    availableSizes: [{ type: String }],
    availableColors: [{ type: String }],
    orderCount: { type: Number, default: 0 },
    comments: [
      {
        id: { type: String, required: true },
        userId: { type: String, required: true },
        authorName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: String, required: true }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ProductModel = model('Product', productSchema);