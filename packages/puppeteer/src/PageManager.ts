import { uuid } from '@liutsing/utils'
import { RpcException } from '@nestjs/microservices'
import { Browser, Page } from 'puppeteer'

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
    console.log(`[PagePool] 获取可用page实例, 当前池大小: ${this.pool.length}`)
    if (this.pool.length > 0) {
      const page = this.pool.pop()
      if (page && !page.isClosed()) return page
    }
    return this.createNewPage(browser)
  }

  private async createNewPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage().catch((e) => {
      console.error('page实例创建失败:', e)
      throw new RpcException(`PAGE_CREATE_FAILED: ${e}`)
    })
    // 监听页面错误事件
    page.on('error', (err) => {
      console.error('Page crashed:', err)
      page.close().catch(console.error) // 自动销毁异常页面
    })
    page.id = uuid()
    console.log(`[PagePool] 创建新page实例 [${page.id}]`)
    return page
  }

  async releasePage(page: Page) {
    if (!this.isPageActive(page)) {
      console.log(`[PagePool] [${page.id}] 失活, 准备关闭`)
      await this.safeClosePage(page)
      return
    }

    if (this.pool.length < this.maxSize && !page.isClosed()) {
      try {
        await this.resetPage(page)
        console.log(`[PagePool] [${page.id}] 重置成功，放回池中`)
        this.pool.push(page)
      } catch (error) {
        console.error(`[PagePool] [${page.id}] 重置失败，直接关闭`, error)
        await this.safeClosePage(page)
      }
    } else {
      console.log(`[PagePool] 池满,  [${page.id}]关闭`)
      await this.safeClosePage(page)
    }
  }

  private isPageActive(page: Page): boolean {
    return !page.isClosed() && page.browser().connected
  }

  private async safeClosePage(page: Page) {
    try {
      if (this.isPageActive(page)) {
        await page
          .close()
          .then(() => console.log(`[PagePool] [${page.id}] 已销毁`))
          .catch(console.error)
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('Target.closeTarget')) console.warn('页面已自动销毁:', page.id)
    }
  }

  async resetPage(page: Page) {
    try {
      if (this.isPageActive(page)) {
        await page.goto('about:blank', {
          timeout: 30000,
          waitUntil: 'networkidle0',
        })

        page.removeAllListeners()
      }
    } catch (error) {
      console.error(`[PagePool] [${page.id}] 重置失败:`, error)
      await this.safeClosePage(page)
      throw new RpcException(`PAGE_RESET_FAILED: ${error instanceof Error ? error.message : error}`)
    }
  }

  async closeAllPages() {
    const pagesToClose = [...this.pool]
    this.pool = []

    console.log(`[PagePool] 开始清理 ${pagesToClose.length} 个页面`)
    await Promise.allSettled(
      pagesToClose.map(async (page) => {
        if (!page.isClosed()) {
          try {
            console.log(`[PagePool] ${page.id}关闭`)
            await page.close()
          } catch (e) {
            if (e instanceof Error && e.message.includes('Target.closeTarget')) return

            console.error('页面关闭异常:', e)
          }
        }
      })
    )
  }
}
