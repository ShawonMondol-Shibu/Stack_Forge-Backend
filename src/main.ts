import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Advanced CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js Dev Client
      'http://localhost:5173', // Vite Dev Client
      process.env.BETTER_AUTH_URL, // Production Frontend Domain (e.g. https://yourdomain.com)
    ].filter(Boolean) as string[], // undefined/null values ফিল্টার করার জন্য
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // Cookies/Auth Headers পাঠানোর জন্য অত্যন্ত জরুরি
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
