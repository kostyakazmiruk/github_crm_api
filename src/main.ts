import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  const allowedOriginsStr =
    process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
  const allowedOrigins = allowedOriginsStr.split(',');
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Github CRM')
    .setDescription(
      'This is a documentation about all possible api. They could be used with /api prefix',
    )
    .addBearerAuth()
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const port: number = parseInt(process.env.SERVICE_PORT ?? '8000', 10);
  await app.listen(port);
  console.log(`Listening ${port}`);
}
bootstrap();
