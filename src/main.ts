import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Función normal para desarrollo local
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 App running on http://localhost:${port}`);
}

// Handler para Vercel serverless (cache de instancia)
let cachedApp: express.Express;

async function createServer() {
  if (!cachedApp) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(AppModule, adapter);

    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();
    cachedApp = expressApp;
    console.log('✅ NestJS serverless instance created');
  }

  return cachedApp;
}

// 🔥 EXPORT PARA VERCEL (esto es lo que faltaba)
export default async (req, res) => {
  const server = await createServer();
  return server(req, res);
};

// Solo ejecuta bootstrap si NO es Vercel
if (!process.env.VERCEL) {
  bootstrap();
}
