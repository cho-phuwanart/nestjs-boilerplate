import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const logger = new Logger();
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port');
  const apiPrefix = configService.get<string>('apiPrefix');

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder().setTitle('The API Document').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port, async () => {
    const appUrl = await app.getUrl();
    logger.log(`Application listening on ${appUrl}${apiPrefix}`);
    logger.log(`View the document at ${appUrl}${apiPrefix}/docs`);
  });
}
bootstrap();
