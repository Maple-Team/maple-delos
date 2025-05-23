import { Controller, Get, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Public } from '@/auth/decorators'

@Controller('microservice-test')
export class MicroserviceTestController {
  constructor(
    @Inject('REDIS_SERVICE') private redisClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
    @Inject('LARAVEL_SERVICE') private laravelClient: ClientProxy
  ) {}

  @Public()
  @Get('/log1')
  log1() {
    this.logClient.emit({ cmd: 'log1' }, 'emit msg') // 向远程服务器发送事件，它是一种异步的、无需等待响应的方式
    this.redisClient.emit({ cmd: 'log1' }, 'emit msg') // 向远程服务器发送事件，它是一种异步的、无需等待响应的方式
    // emit to laravel microservice
    this.laravelClient.emit('greeting', '123')
  }

  @Public()
  @Get('/log2')
  log2() {
    return this.logClient.send({ cmd: 'log2' }, 'send msg') // 更适合用于发送请求并等待远程服务器的响应。它是一种同步的方式，发送消息后会等待远程服务器的响应，然后再继续执行后续的代码。
  }
}
