import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices'
import { AppService } from './app.service'

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
  captureScreenshot(@Payload() payload, @Ctx() context) {
    const { url } = payload
    console.log(context, 'context')
    console.log(payload, 'payload')
    return this.service.generateScreenshot(url)
  }

  @MessagePattern({ cmd: 'fetchSyzList' })
  fetchSyzList(@Payload() payload, @Ctx() context) {
    const { pageNo } = payload
    console.log(context, 'context')
    console.log(payload, 'payload')
    return this.service.fetchList(pageNo)
  }

  @MessagePattern({ cmd: 'crawleeSyzList' })
  crawleeSyzList(@Payload() payload, @Ctx() context) {
    const { urls } = payload
    console.log(context, 'context')
    console.log(payload, 'payload')
    return this.service.crawlee(urls)
  }
}
