import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    preferredLanguage: { type: String, enum: ['en', 'am'], default: 'en' },
    preferredTheme: { type: String, enum: ['light', 'dark'], default: 'light' },
    defaultAddress: {
      region: String,
      city: String,
      subCity: String,
      woreda: String,
      landmark: String
    }
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);