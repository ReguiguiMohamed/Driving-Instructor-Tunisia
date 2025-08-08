import { ValidationPipe } from '@nestjs/common';
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

// CORRECT - Works on Railway
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for your mobile app
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Use Railway's assigned port, fallback to 8080 for local development
  const port = process.env.PORT || 8080;
  
  // Bind to 0.0.0.0 so Railway can access it
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();