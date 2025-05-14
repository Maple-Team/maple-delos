import { Buffer } from 'buffer'
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import amqp from 'amqplib'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { Task } from '@liutsing/common-types'
import { getTimeStr } from '@/utils'

const QUEUE_NAME = 'download_tasks'
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:bitnami@localhost:5672/'
// FIXME 引入crawlee会报ts类型错误

@Injectable()
export class SYZCrawleeService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel
  private connection: amqp.Connection
  constructor(
    @Inject('PUPPETEER_SERVICE') private puppeteerService: ClientProxy,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async onModuleInit() {
    // 连接RabbitMQ
    this.connection = await amqp.connect(RABBITMQ_URL)
    this.channel = await this.connection.createChannel()
    await this.channel.assertQueue(QUEUE_NAME, { durable: true })
  }

  async onModuleDestroy() {
    // 关闭连接
    await this.channel.close()
    await this.connection.close()
  }

  async sendTask(task: Task) {
    try {
      // 发送任务消息（JSON序列化）
      const message = JSON.stringify(task)
      this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true })
      //   console.log(`[${getTimeStr()}] 已发送任务: ${message}`)
    } catch (err) {
      console.error(`[${getTimeStr()}] 发送任务失败:`, err)
    }
  }

  async fetchList(pageNo: number) {
    return firstValueFrom(this.puppeteerService.send({ cmd: 'fetchSyzList' }, { pageNo }))
  }

  crawlee(urls: string[]) {
    if (!urls || urls.length === 0) {
      console.log(`[${getTimeStr()}] 无爬取的url链接任务`)
      return
    }
    this.puppeteerService.send({ cmd: 'crawleeSyzList' }, { urls }).subscribe({
      next: (tasks: Task[]) => {
        if (!tasks || tasks.length === 0) {
          console.log(`[${getTimeStr()}] 上游页面无爬取的任务`)
          return
        }
        tasks.forEach((task: Task) => {
          this.sendTask(task).catch((e) => {
            console.error(`[${getTimeStr()}] 发送任务失败: ${e}`)
          })
        })
        const pageUrls = [
          ...new Set(
            tasks.map((t) => ({
              url: t.pageUrl, // https://tieba.baidu.com/p/9344621227
              galleryName: t.galleryName,
            }))
          ),
        ]
        pageUrls.forEach((u) => {
          // 9056593432 filename 240618_RO更新(xx)
          const item = `${u.url.replace(/[^\d]*(\d+)+/, (_, $1) => $1)} filename ${u.galleryName}`
          // 9049155572 filename 240611_RO更新_xx (无其他符号)
          // console.log(`[${getTimeStr()}] 待判断的item: ${item}`)
          this.redis.srem('syz/gallery:pending', item).catch(console.log)
          this.redis.sadd('syz/gallery:completed', item).catch(console.log)
        })

        console.log(`[${getTimeStr()}] 已发送${tasks.length}个任务： `)
      },
      error: (err) => {
        const message = err.message
        console.error(`[${getTimeStr()}] 捕获到上游错误:`, message)
        // TODO 更精细的区分
        if (message.includes('CRAWL_FAILED')) {
          // 处理特定错误
          const url = message.split(' ')[1]
          if (message.includes('Navigation timeout')) console.log(`[${getTimeStr()}] 重试爬取任务: ${url}`)
          // TODO 重试不生效
          // sleep(2000)
          //   .then(() => {
          //     this.crawlee([url])
          //   })
          //   .catch(console.error)
        }
      },
      complete: () => {
        console.log(`[${getTimeStr()}] 爬取完成`)
      },
    })
  }
}
