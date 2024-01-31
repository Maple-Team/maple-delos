import { NestFactory } from '@nestjs/core'
import type { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
  /**
   * This example contains a hybrid application (HTTP + TCP)
   * You can switch to a microservice with NestFactory.createMicroservice() as follows:
   *
   * const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
   *  transport: Transport.TCP,
   *  options: {
   * retryAttempts: 5,
   * retryDelay: 3000,
   * host: '0.0.0.0',
   * port: 8801, },
   * });
   * await app.listen();
   *
   */
  // 创建一个微服务
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      retryAttempts: 5,
      retryDelay: 3000,
      host: '0.0.0.0',
      port: 8801,
    },
  })
  await app.listen()

  //   const app = await NestFactory.create(AppModule)
  //   app.connectMicroservice<MicroserviceOptions>({
  //     transport: Transport.TCP,
  //     options: {
  //       retryAttempts: 5,
  //       retryDelay: 3000,
  //       host: '0.0.0.0',
  //       port: 8801,
  //     },
  //   })

  //   await app.startAllMicroservices().then(() => {
  //     console.log('Application microservice is running on')
  //   })
  //   app.listen().catch(console.error)
}
bootstrap().catch(console.error)
