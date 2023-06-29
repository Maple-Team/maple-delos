import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_SERVICE}`,
      clientId: process.env.MQTT_SERVICE_CLIENT_ID,
    },
  })
  app.listen()
}
bootstrap()
