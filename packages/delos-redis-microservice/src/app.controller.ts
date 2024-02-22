import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, MessagePattern, Payload, RedisContext } from '@nestjs/microservices'
import { AppService } from './app.service'

/**
 * TODO
 * 1. log test
 * 2. user request log
 * 3. business analysis
 * 4. form body log
 */
@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @EventPattern({ cmd: 'log1' }) // ignore return
  log(text: unknown): void {
    console.log('redis service: ', JSON.stringify(text))
    // TODO 写到mongoDB
  }
  // 来自redis sub的消息
  @MessagePattern({ cmd: 'greeting' })
  testMicroservice(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`, data)
    return { name: '123' }
  }
}
