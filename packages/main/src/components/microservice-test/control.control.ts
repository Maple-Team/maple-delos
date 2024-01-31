import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common'
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { Public } from '@/auth/decorators'

@Controller('microservice-test')
@UseInterceptors(TransformInterceptor)
export class MicroserviceTestController {
  constructor(
    // @Inject('LARAVEL_SERVICE') private laravelClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy
  ) {}

  @Public()
  @Get('/log1')
  log1() {
    this.logClient.emit({ cmd: 'log1' }, 'emit mesg') // 向远程服务器发送事件，它是一种异步的、无需等待响应的方式
  }

  @Public()
  @Get('/log2')
  log2() {
    return this.logClient.send({ cmd: 'log2' }, 'send msg') // 更适合用于发送请求并等待远程服务器的响应。它是一种同步的方式，发送消息后会等待远程服务器的响应，然后再继续执行后续的代码。
  }

  // listen
  @MessagePattern({ cmd: 'greeting' })
  testMicroservice(@Payload() data: number[], @Ctx() context: RedisContext) {
    console.log(`Channel: ${context.getChannel()}`, data)

    // this.laravelClient.emit('greeting_res', '123')
    return { name: '123' }
  }
}
