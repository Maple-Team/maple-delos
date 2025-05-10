import { Buffer } from 'buffer'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Page } from 'puppeteer'
import amqp from 'amqplib'
import { PuppeteerService } from '../puppeteer/puppeteer.service'

const QUEUE_NAME = 'download_tasks'
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:bitnami@localhost:5672/'
// FIXME 引入crawlee会报ts类型错误

interface Task {
  url: string
  ObjectName: string
  galleryName: string
}

@Injectable()
export class SYZCrawleeService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel
  private connection: amqp.Connection
  constructor(private readonly puppeteerService: PuppeteerService) {}

  async onModuleInit() {
    // 连接RabbitMQ
    this.connection = await amqp.connect(RABBITMQ_URL)
    this.channel = await this.connection.createChannel()
    await this.channel.assertQueue(QUEUE_NAME, { durable: true })
    console.log('RabbitMQ connected')
  }

  async onModuleDestroy() {
    // 关闭连接
    await this.channel.close()
    await this.connection.close()
    console.log('RabbitMQ disConnected')
  }

  async crawlee(list: string[]) {
    if (!list.length) return
    const browser = await this.puppeteerService.getBrowser()
    if (!browser) throw new Error('Browser not found')

    const page: Page = await browser.newPage()

    const urls = list
      .map((i) => i.split(' ').shift())
      .filter(Boolean)
      .map((id) => `https://tieba.baidu.com/p/${id}`)

    urls
      .reduce((prev: Promise<void>, url: string) => {
        return prev.then(async () => {
          await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 15000,
          })
          const tasks = await page.evaluate(() => {
            const formatName = (name: string) => {
              return `${name
                .replace(/\s*\(/g, '_')
                .replace(/\s*（/g, '_')
                .replace(/\)/g, '')
                .replace(/）/g, '')
                .replace(/"/g, '')
                .replace(/&/g, '')}`
            }
            const dir = document.querySelector('.core_title_txt')?.textContent?.trim()
            if (!dir) return []
            const tasks = []
            Array.from(document.querySelectorAll('.BDE_Image')).forEach((el) => {
              const url = el.getAttribute('src')
              // http://tiebapic.baidu.com/forum/w%3D580/sign=a0f0a50e8f3d70cf4cfaaa05c8ddd1ba/dda4293d269759eee2a397fcf4fb43166c22dff2.jpg?tbpicau=2024-01-05-05_575facc80ed93f040dfaeb7e2bdaefd1
              if (url) {
                const filename = url.replace(/.*\/([a-z0-9]*\.jpg).*/, (_, f) => f)
                const task: Task = {
                  url,
                  ObjectName: filename,
                  galleryName: formatName(dir),
                }
                tasks.push(task)
              }
            })
            return tasks
          })
        //   console.log(`${url} 已完成，共 ${tasks.length} 个任务}`)
          tasks.forEach((task) => {
            this.sendTask(task).catch(console.error)
          })
          return Promise.resolve()
        })
      }, Promise.resolve())
      .catch((e) => {
        console.error(e)
      })
  }

  async fetchList() {
    const browser = await this.puppeteerService.getBrowser()
    if (!browser) throw new Error('Browser not found')

    const page: Page = await browser.newPage()
    // https://tieba.baidu.com/f?kw=%E5%AD%99%E5%85%81%E7%8F%A0&ie=utf-8&pn=50
    // https://tieba.baidu.com/f?kw=%E5%AD%99%E5%85%81%E7%8F%A0&ie=utf-8&pn=100
    await page.goto('https://tieba.baidu.com/f?ie=utf-8&kw=%E5%AD%99%E5%85%81%E7%8F%A0', {
      waitUntil: 'networkidle2',
      timeout: 15000,
    })
    console.log('syz page loaded')
    const urls = await page.evaluate(() => {
      const html = document.documentElement.outerHTML

      const list = Array.from(document.querySelectorAll('.j_thread_list')).filter(
        (el) => !el.classList.contains('thread_top')
      )
      const urls = Array.from(list)
        .map((el) => {
          const tid = el.querySelector('.threadlist_title')?.textContent?.trim()
          const filename = 'filename'
          let pid = '0'
          try {
            const arr = el.querySelector('a')?.getAttribute('href')?.split('/')
            pid = arr?.pop() || '0'
          } catch (error) {
            return `${JSON.stringify(error)} ${tid}`
          }
          return [pid, filename, tid].join(' ')
        })
        .map((i) => [i, html])

      if (!urls.length) return [['可能触发了防爬机制~，请稍后再试', html]]
      return urls
    })

    return urls
  }

  async sendTask(task: Task) {
    try {
      // 发送任务消息（JSON序列化）
      const message = JSON.stringify(task)
      this.channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true })
      console.log(`[x] 已发送任务: ${message}`)
    } catch (err) {
      console.error('发送任务失败:', err)
    }
  }
}
