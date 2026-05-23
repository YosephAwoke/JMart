import { createServer } from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  await connectDatabase();
  const app = createServer();

  app.listen(port, () => {
    console.log(`JMart API running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);
});