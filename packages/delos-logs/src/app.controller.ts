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
  log1(text: unknown) {
    console.log('reveive msg: ', JSON.stringify(text))
  }

  @MessagePattern({ cmd: 'log2' }) // wait return
  log2(text: unknown) {
    console.log('reveive msg: ', JSON.stringify(text))
    return '123'
  }

  @MessagePattern({ cmd: 'greeting' })
  testMicroservice(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`, data)
    return { name: '123' }
  }
}
