import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PuppeteerController } from './puppeteer.controller'

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10, // 限制每分钟最多10次请求
    // }),
    ClientsModule.register([
      {
        name: 'PUPPETEER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PUPPETEER_SERVICE,
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [PuppeteerController],
})
export class PuppeteerModule {}
