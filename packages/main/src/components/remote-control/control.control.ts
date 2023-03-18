import { Body, Controller, Get, Inject, Query, UseInterceptors } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import type { SendCommandParams } from '@liutsing/types-utils'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'

@Controller('vehicle-control')
@UseInterceptors(TransformInterceptor)
export class ControlController {
  constructor(
    @Inject('REMOTE_CONTROL_SERVICE') private controlClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy
  ) {}

  @Get('/sendCmd')
  sendCmd(@Body() payload: SendCommandParams) {
    this.logClient.emit('sendCmd', payload)
    return this.controlClient.send('sendCmd', payload)
  }

  @Get('/getVehConResult')
  getVehConResult(@Body() payload: SendCommandParams) {
    this.logClient.emit('getVehConResult', payload)
    return this.controlClient.send('getVehConResult', payload)
  }

  @Get('/getLatestTracking')
  getLatestTracking(@Query('vin') vin: string) {
    this.logClient.emit('getLatestTracking', vin)
    return this.controlClient.send('getLatestTracking', vin)
  }
}
