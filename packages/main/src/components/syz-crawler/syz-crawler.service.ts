// import { Buffer } from 'buffer'
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import amqp from 'amqplib'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

// const QUEUE_NAME = 'download_tasks'
// const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:bitnami@localhost:5672/'
// FIXME 引入crawlee会报ts类型错误

interface Task {
  url: string
  objectName: string
  galleryName: string
  personName: string
}

@Injectable()
export class SYZCrawleeService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel
  private connection: amqp.Connection
  constructor(@Inject('PUPPETEER_SERVICE') private puppeteerService: ClientProxy) {}

  async onModuleInit() {
    // 连接RabbitMQ
    // this.connection = await amqp.connect(RABBITMQ_URL)
    // this.channel = await this.connection.createChannel()
    // await this.channel.assertQueue(QUEUE_NAME, { durable: true })
    // console.log('RabbitMQ connected')
  }

  async onModuleDestroy() {
    // 关闭连接
    await this.channel.close()
    await this.connection.close()
    console.log('RabbitMQ disConnected')
  }

  async sendTask(task: Task) {
    console.log('发送任务:', task)
    // try {
    //   // 发送任务消息（JSON序列化）
    //   const message = JSON.stringify(task)
    //   this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true })
    //   //   console.log(`[x] 已发送任务: ${message}`)
    // } catch (err) {
    //   console.error('发送任务失败:', err)
    // }
  }

  async fetchList(pageNo: number) {
    return firstValueFrom(this.puppeteerService.send({ cmd: 'fetchSyzList' }, pageNo))
  }

  crawlee(urls: string[]) {
    if (!urls || urls.length === 0) {
      console.log('无爬取的url链接任务')
      return
    }
    this.puppeteerService.send({ cmd: 'crawleeSyzList' }, { urls }).subscribe({
      next: (tasks: Task[]) => {
        if (!tasks || tasks.length === 0) {
          console.log('上游数据异常', tasks)
          return
        }
        tasks.forEach((task: Task) => {
          this.sendTask(task).catch((e) => {
            console.error(`发送任务失败: ${e}`)
          })
        })
        console.log(`已发送${tasks.length}个任务`)
      },
      error: (err) => {
        const message = err.message
        console.error('捕获到爬虫错误:', message)
        if (message.includes('CRAWL_FAILED')) {
          // 处理特定错误
          const url = message.split(' ')[1]
          console.log(`重试爬取任务: ${url}`)
          // TODO 重试爬取任务
          //  this.crawlee([url])
        }
      },
      complete: () => {
        console.log('爬取完成')
      },
    })
  }
}
