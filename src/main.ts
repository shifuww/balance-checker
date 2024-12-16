import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';
const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORT;
  const host = configService.get<string>('HOST') || DEFAULT_HOST;

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const packageJson: { version: string; name: string; description: string } =
    JSON.parse(readFileSync('./package.json').toString());
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(GLOBAL_PREFIX, app, document);

  app.enableCors({
    credentials: true,
    origin: ['*'],
  });

  await app.listen(port, host, () =>
    Logger.log(
      `🚀 Application is running on: http://${host}:${port}/${GLOBAL_PREFIX}`,
    ),
  );
}
bootstrap();
