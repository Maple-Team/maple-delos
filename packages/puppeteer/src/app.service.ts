import { Injectable, OnModuleDestroy } from '@nestjs/common'
import puppeteer from 'puppeteer-extra'
import { Browser as CoreBrowser, Page } from 'puppeteer-core'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

@Injectable()
export class AppService implements OnModuleDestroy {
  private browser: CoreBrowser | null = null
  private activeTasks: Map<string, ScreenshotTask> = new Map()
  // TODO： 使用微服务的方式：1.方便部署与nodejs服务隔离 2.方便扩展与维护
  // 初始化浏览器实例
  async getBrowser(): Promise<CoreBrowser> {
    if (!this.browser || !this.browser.connected) {
      this.browser = (await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars', // 隐藏自动化特征
          '--disable-gpu', // Docker 中通常不需要 GPU 加速
          '--single-process', // 优化容器资源使用
          '--no-zygote', // 减少内存占用
          '--window-size=1280,720',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          '--disable-blink-features=AutomationControlled', // 禁用自动化控制特征
        ],
        timeout: 30000,
        ...(process.env.NODE_ENV === 'development'
          ? {
              executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
              userDataDir: 'C:\\Users\\liuts\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
            }
          : {}),
      })) as unknown as CoreBrowser
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
    if (this.browser) {
      await this.browser.close()
      console.log('Browser closed')
      this.browser = null
    }
  }

  async crawlee(list: string[]) {
    if (!list.length) return
    const browser = await this.getBrowser()
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
                  objectName: filename,
                  galleryName: formatName(dir),
                  personName: '孙允珠',
                }
                tasks.push(task)
              }
            })
            return tasks
          })
          //   console.log(`${url} 已完成，共 ${tasks.length} 个任务}`)
          tasks.forEach((task) => {
            // TODO
            // this.sendTask(task).catch(console.error)
          })
          console.log(`${url} 已完成，共发送${tasks.length}个任务}`)
          return Promise.resolve()
        })
      }, Promise.resolve())
      .catch((e) => {
        console.error(e)
      })
  }

  async fetchList(pageNo = 0) {
    const browser = await this.getBrowser()
    if (!browser) throw new Error('Browser not found')

    const page: Page = await browser.newPage()
    const url = `https://tieba.baidu.com/f?ie=utf-8&kw=%E5%AD%99%E5%85%81%E7%8F%A0&ie=utf-8&pn=${pageNo * 50}`
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    })
    console.log(`开始爬取: ${url}`)
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
}
