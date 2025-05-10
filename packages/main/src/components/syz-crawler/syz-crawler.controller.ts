import fs from 'fs'
import path from 'path'
import { Controller, Get, Query } from '@nestjs/common'
import dayjs from 'dayjs'
import { SYZCrawleeService } from './syz-crawler.service'

@Controller('syz')
export class SYZCrawleeController {
  constructor(private readonly crawleeService: SYZCrawleeService) {}

  @Get('start')
  async startCrawling(@Query('pageNo') pageNo = 0) {
    const urls = await this.crawleeService.fetchList(pageNo)
    console.log(`抓取结果: ${urls[0][0]}`)
    const html = urls[0][1]
    fs.writeFile(
      path.join(path.resolve(process.cwd(), './logs'), `syz-crawler-${dayjs().format('YYYY-MM-DD-HH-mm')}.html`),
      html,
      (err) => {
        if (err) console.error(err)
      }
    )

    const validUrls = urls
      .filter((i) => i[0].split(' ').length === 3)
      .filter(Boolean)
      .flat()

    this.crawleeService.crawlee(validUrls).catch(console.error)
  }
}
