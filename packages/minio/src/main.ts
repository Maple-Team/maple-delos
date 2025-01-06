import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

const port = 3002
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  })
  app
    .listen()
    .then(() => {
      console.log(`nestjs-minio is listen on ${port}`)
    })
    .catch(console.error)
}
bootstrap().catch(console.error)
