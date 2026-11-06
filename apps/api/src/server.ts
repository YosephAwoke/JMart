import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import mongoose from 'mongoose';
import { createServer } from './app.js';

const port = process.env.PORT;

async function bootstrap() {
  await connectDatabase();
  const app = createServer();

  app.listen(port, () => {
    console.log(`JMart API running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);});