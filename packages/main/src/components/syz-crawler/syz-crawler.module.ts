import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { SYZCrawleeController } from './syz-crawler.controller'
import { SYZCrawleeService } from './syz-crawler.service'

@Module({
  imports: [
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
  controllers: [SYZCrawleeController],
  providers: [SYZCrawleeService],
})
export class CheerioCrawleeModule {}
