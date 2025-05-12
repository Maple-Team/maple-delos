import { uuid } from '@liutsing/utils'
import { RpcException } from '@nestjs/microservices'
import { Browser, HTTPRequest, Page } from 'puppeteer'

declare module 'puppeteer' {
  interface Page {
    id: string
  }
}

export class PageManager {
  pool: Page[]
  maxSize: number
  constructor(maxSize = 5) {
    this.pool = []
    this.maxSize = maxSize
  }

  async getPage(browser: Browser) {
    if (this.pool.length > 0) {
      const page = this.pool.pop()
      if (page && !page.isClosed()) return page
    }
    return this.createNewPage(browser)
  }
  // page.on('request', (req) => {
  //   const blockResources = ['image', 'stylesheet', 'font', 'media']
  //   if (blockResources.includes(req.resourceType())) {
  //     // console.log(`[${getTimeStr()}] 拦截资源: ${req.resourceType()} ${req.url()}`)
  //     if (req.isInterceptResolutionHandled()) return
  //     req.abort()
  //     // req.continue()
  //   } else {
  //     if (req.isInterceptResolutionHandled()) return
  //     req.continue()
  //   }
  // })
  // await page.setBypassCSP(true)
  // // 确保先启用请求拦截，再导航到页面
  // await page.setRequestInterception(true)

  private unifiedRequestHandler(req: HTTPRequest) {
    const blockResources = ['image', 'stylesheet', 'font', 'media']
    if (req.isInterceptResolutionHandled()) return

    if (blockResources.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  }

  private async createNewPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage().catch((e) => {
      console.error('页面创建失败:', e)
      throw new RpcException(`PAGE_CREATE_FAILED: ${e}`)
    })
    await page.setBypassCSP(true)
    // 确保先启用请求拦截，再导航到页面
    await page.setRequestInterception(true)
    page.on('request', this.unifiedRequestHandler)
    // 监听页面错误事件
    page.on('error', (err) => {
      console.error('Page crashed:', err)
      page.close() // 自动销毁异常页面
    })
    page.id = uuid()
    return page
  }

  releasePage(page: Page) {
    if (this.pool.length < this.maxSize && !page.isClosed()) {
      this.resetPage(page)
      this.pool.push(page)
    } else {
      page.close() // 超过上限则销毁
    }
  }

  async resetPage(page: Page) {
    // 清理存储和 Cookie
    await page.deleteCookie()
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.goto('about:blank') // 导航到空白页释放内存
  }
  async closeAllPages() {
    for (const page of this.pool) {
      if (!page.isClosed()) {
        await page.close()
      }
    }
    this.pool = []
  }
}
