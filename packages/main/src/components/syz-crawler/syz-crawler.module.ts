import { Module } from '@nestjs/common'
import { PuppeteerModule } from '../puppeteer/puppeteer.module'
import { PuppeteerService } from '../puppeteer/puppeteer.service'
import { SYZCrawleeController } from './syz-crawler.controller'
import { SYZCrawleeService } from './syz-crawler.service'

@Module({
  imports: [PuppeteerModule],
  controllers: [SYZCrawleeController],
  providers: [SYZCrawleeService, PuppeteerService],
})
export class CheerioCrawleeModule {}
