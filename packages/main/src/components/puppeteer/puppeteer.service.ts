import { Injectable, OnModuleDestroy } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
import puppeteer, { Browser, Page } from 'puppeteer'

interface ScreenshotTask {
  id: string
  url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: string // Base64 图片数据
  error?: string
}

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  private browser: Browser | null = null
  private activeTasks: Map<string, ScreenshotTask> = new Map()

  //   constructor(private configService: ConfigService) {}

  // 初始化浏览器实例
  async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 30000,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        // timeout: this.configService.get<number>('PUPPETEER_TIMEOUT', 30000),
      })
    }
    return this.browser
  }

  // 生成网页截图
  async generateScreenshot(url: string): Promise<ScreenshotTask> {
    const taskId = Date.now().toString()
    const task: ScreenshotTask = {
      id: taskId,
      url,
      status: 'pending',
    }

    this.activeTasks.set(taskId, task)

    try {
      task.status = 'processing'
      const browser = await this.getBrowser()
      const page: Page = await browser.newPage()

      await page.setViewport({ width: 1280, height: 800 })
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })

      const screenshot = await page.screenshot({
        type: 'png',
        encoding: 'base64',
        fullPage: true,
      })

      task.status = 'completed'
      task.result = `data:image/png;base64,${screenshot}`
    } catch (error) {
      task.status = 'failed'
      task.error = error instanceof Error ? error.message : '截图生成失败'
    } finally {
      this.activeTasks.delete(taskId)
    }

    return task
  }

  // 获取当前活动任务
  getActiveTasks(): ScreenshotTask[] {
    return Array.from(this.activeTasks.values())
  }

  // 关闭浏览器实例
  async onModuleDestroy() {
    if (this.browser) await this.browser.close()
  }
}
