import { Controller, Get } from '@nestjs/common'
import { DefaultGateway } from './default.gateway'

@Controller('alert')
export class DefaultGatewayController {
  constructor(private readonly gateway: DefaultGateway) {}

  @Get()
  alert() {
    this.gateway.alert()
  }
}
