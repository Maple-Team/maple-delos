import fs from 'fs'
import path from 'path'
import { Controller, Get, Query } from '@nestjs/common'
import dayjs from 'dayjs'
import { SYZCrawleeService } from './syz-crawler.service'
import { getTimeStr } from '@/utils'

@Controller('syz')
export class SYZCrawleeController {
  constructor(private readonly crawleeService: SYZCrawleeService) {}

  @Get('start')
  async startCrawling(@Query('pageNo') pageNo = 0) {
    // FIXME 1. 第二次请求，不响应(待定位原因)
    const urls = await this.crawleeService.fetchList(pageNo)
    console.log(`[${getTimeStr()}] 抓取结果抽样: ${urls[0][0]}`)
    const html = urls[0][1]
    fs.writeFile(
      path.join(path.resolve(process.cwd(), './logs'), `syz-crawler-${dayjs().format('YYYY-MM-DD-HH-mm')}.html`),
      html,
      (err) => {
        if (err) console.error(err)
      }
    )

    const validUrls: string[] = urls.filter((i) => i[0].split(' ').length === 3).flatMap((i) => i[0])

    console.log(`[${getTimeStr()}] 有效urls: ${validUrls.length}个`)

    this.crawleeService.crawlee(validUrls)
  }
}
