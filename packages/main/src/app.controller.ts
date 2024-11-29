import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, UnauthorizedException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { sleep } from '@liutsing/utils'
import { AppService } from './app.service'
import { Public } from './auth/decorators'

@Public()
@Controller('app')
// @UseFilters(new HttpExceptionFilter()) controller scope
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Get()
  hello(): string {
    return this.appService.hello()
  }

  @Post()
  async post(@Body() body) {
    this.logger.debug('%o', body)
    return body
  }

  @Get('hello')
  async json() {
    await sleep(500)
    // 400
    if (Math.random() > 0.5) throw new UnauthorizedException('Forbidden')
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
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN,
      {
        cause: new Error(),
        description: 'some error',
      }
    )
  }
}
