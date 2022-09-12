import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    // type: VersioningType.URI,
    type: VersioningType.HEADER,
    header: 'X-API-VERSION', // 不同的版本类型 https://docs.nestjs.com/techniques/versioning
  });
  await app.listen(3090);
}
bootstrap();
