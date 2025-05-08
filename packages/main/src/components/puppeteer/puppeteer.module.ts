import { Module } from '@nestjs/common'
// import { ThrottlerModule } from '@nestjs/throttler'
import { PuppeteerController } from './puppeteer.controller'
import { PuppeteerService } from './puppeteer.service'

@Module({
  imports: [
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10, // 限制每分钟最多10次请求
    // }),
  ],
  controllers: [PuppeteerController],
  providers: [PuppeteerService],
})
export class PuppeteerModule {}
