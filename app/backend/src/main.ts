import { NestFactory } from '@nestjs/core';
// test comment
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('NODE_ENV:', process.env.NODE_ENV);

  const app = await NestFactory.create(AppModule);

  // CORS設定
  app.enableCors({
    origin: ['http://localhost:5173'], // フロントエンドのURL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  // グローバルValidationPipeを設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger設定
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('Todo application API documentation')
    .setVersion('1.0')
    .addTag('todos')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
