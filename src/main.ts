import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: '*', methods: ['POST', 'GET', 'PATCH', 'DELETE'] });
  const config = new DocumentBuilder()
    .setTitle('Scholar Api')
    .setDescription(
      'This is the official api documentation of the popular social media platform for students seeking for scholarship abroad',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('', app, document, { useGlobalPrefix: true });

  await app.listen(3000);
}
bootstrap();
