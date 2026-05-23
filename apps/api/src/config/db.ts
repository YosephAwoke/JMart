import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/jmart';
  try {
    await mongoose.connect(uri);
    return true;
  } catch (error) {
    console.warn('MongoDB unavailable, continuing with seeded fallback data.', error);
    return false;
  }
}