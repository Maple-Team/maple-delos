import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: isProd ? 'mqtt://mqtt-server:1883' : 'mqtt://localhost:1883',
        clientId: isProd ? 'nestjs-mqtt-client' : 'nestjs-dev-mqtt-client',
      },
    },
  );
  app.listen();
}
bootstrap();
