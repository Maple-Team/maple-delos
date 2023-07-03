import { Body, Controller, Post } from '@nestjs/common'
import { DefaultGateway } from './default.gateway'

@Controller()
export class DefaultGatewayController {
  // 其他controller或service，通过依赖注入访问实例，调用实例方法完成业务需要
  constructor(private readonly gateway: DefaultGateway) {}

  @Post('test1')
  test1(@Body() body: { id?: string }) {
    this.gateway.test1(body.id)
  }
}
