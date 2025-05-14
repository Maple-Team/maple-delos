import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, TcpContext } from '@nestjs/microservices'
import { AppService } from './app.service'
import { getTimeStr } from './utils'

// EventPattern: 忽略返回值
// MessagePattern: 等待返回值

@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @MessagePattern({ cmd: 'getActiveTasks' })
  getActiveTasks(): ScreenshotTask[] {
    return this.service.getActiveTasks()
  }

  @MessagePattern({ cmd: 'captureScreenshot' })
  captureScreenshot(@Payload() payload, @Ctx() context: TcpContext) {
    const { url } = payload
    console.log(context, payload)
    return this.service.generateScreenshot(url)
  }

  @MessagePattern({ cmd: 'fetchSyzList' })
  fetchSyzList(@Payload() payload) {
    const { pageNo } = payload
    console.log(`[${getTimeStr()}] 接收到fetchSyzList任务`)
    return this.service.fetchList(pageNo)
  }

  @MessagePattern({ cmd: 'crawleeSyzList' })
  crawleeSyzList(@Payload() payload) {
    const { urls } = payload
    return this.service.crawlee(urls || [])
  }
}
