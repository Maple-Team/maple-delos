import fs from 'fs'
import path from 'path'
import { Controller, Get, Query } from '@nestjs/common'
import dayjs from 'dayjs'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { Interval } from '@nestjs/schedule'
import { SYZCrawleeService } from './syz-crawler.service'
import { formatName, getTimeStr } from '@/utils'

@Controller('syz')
export class SYZCrawleeController {
  constructor(private readonly crawleeService: SYZCrawleeService, @InjectRedis() private readonly redis: Redis) {}

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
    /**
     *  有效的urls
     * 每一条的数据：9056593432 filename 240618_RO更新(xx)
     */
    const validUrls: string[] = urls.filter((i) => i[0].split(' ').length === 3).flatMap((i) => formatName(i[0]))
    const existUrls = await this.redis.sunion('syz/gallery:completed', 'syz/gallery:pending')
    const newUrls = validUrls.filter((url) => {
      //   const tUrl = `https://tieba.baidu.com/p/${url.split(' ')[0]}`
      return !existUrls.includes(formatName(url))
    })
    if (newUrls.length > 0) await this.redis.sadd('syz/gallery:pending', newUrls)

    const pendingUrls = await this.redis.smembers('syz/gallery:pending')
    console.log(`[${getTimeStr()}] 待处理任务数量: ${pendingUrls.length}个`)

    this.crawleeService.crawlee(pendingUrls)
  }

  // @Cron('45 * * * * *')
  @Interval(5 * 60 * 1000)
  async handlePendingTasks() {
    const pendingUrls = await this.redis.smembers('syz/gallery:pending')
    console.log(`[${getTimeStr()}] 定时任务触发，待处理任务数量: ${pendingUrls.length}个`)
    if (pendingUrls.length > 0) this.crawleeService.crawlee(pendingUrls)
  }
}
