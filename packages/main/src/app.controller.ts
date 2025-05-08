import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger as NestLogger,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { sleep } from '@liutsing/utils'
import { RedisClientType } from 'redis'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'
import { AppService } from './app.service'
import { Public, WithContext } from './auth/decorators'

@Public()
@Controller('')
@WithContext(AppController.name)
// @UseFilters(new HttpExceptionFilter()) controller scope
export class AppController {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  private nestLogger = new NestLogger()
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRedis() private readonly redis: Redis
  ) {}

  @Get('/logger-test')
  loggerTest(): string {
    // 附带metadata信息
    this.logger.info('hello')
    this.nestLogger.debug('hello', 'aa', AppController.name)
    return this.appService.hello()
  }

  @Get('/redis-test')
  async redisTest(): Promise<string> {
    await this.redis.set('key', 'Redis data!')
    const redisData = await this.redis.get('key')
    console.log(redisData)
    await this.redisClient.set('key', 'Redis data!')
    const redisData2 = await this.redisClient.get('key')
    console.log(redisData2)
    return this.appService.hello()
  }

  @Post()
  async post(@Body() body) {
    this.logger.debug('%o', body)
    return body
  }

  @Get('test')
  async test() {
    //
    await sleep(500)
    // 400
    if (Math.random() > 0.5) throw new UnauthorizedException('Forbidden')
    else if (Math.random() > 0.9) throw new Error('Error')
    else return 'ok'

    // 502 test
    // throw new BadGatewayException()
    // 测试logger的输出结果
    // this.logger.log(
    //   'info',
    //   'first is an object', // %j: 将对象转换为 JSON 字符串？
    //   //   { beAware: 'this will interpolate' },
    //   new Error('error')
    //   // 额外的数据
    //   //   {
    //   //     label: 'label',
    //   //     extra: true,
    //   //   }
    // )
    // 简写方式，需要保证这个level大于等于配置的level
    // this.logger.debug('error: %s', new Error('error'))
    // this.logger.debug('%s', [1, 2, 3])
    // this.logger.debug('%j', [1, 2, 3])
    // const obj = {
    //   a: 1,
    //   b: {
    //     c: '2',
    //   },
    // }
    // this.logger.debug('%%s: %s', obj, { extra: '1' }) // "message":"%s: { a: 1, b: [Object] } 不能处理嵌套对象"
    // this.logger.debug('%%o: %o', obj, { extra: '1' }) // "message":"%o: { a: 1, b: { c: '2' } }
    // this.logger.debug('%%j: %j', obj, { extra: '1' }) // "message":"%j: {\"a\":1,\"b\":{\"c\":\"2\"}}
    // this.logger.debug('123')
    return {
      message: this.appService.hello(),
      info: {
        name: 'test',
      },
    }
  }

  @Get('403')
  //   @UseFilters(new HttpExceptionFilter()) // method scope
  async findAll() {
    throw new HttpException('This is a custom message', HttpStatus.FORBIDDEN, {
      cause: new Error(),
      description: 'some error',
    })
  }

  @Get()
  hello(): string {
    // NOTE 没有走中间件
    return this.appService.hello()
  }
}
