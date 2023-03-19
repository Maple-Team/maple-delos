import { Body, Controller, Get, Inject, Query, UseInterceptors, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import type { SendCommandParams } from '@liutsing/types-utils'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'

@Controller('vehicle-control')
@UseInterceptors(TransformInterceptor)
export class ControlController {
  constructor(
    @Inject('REMOTE_CONTROL_SERVICE') private controlClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy
  ) {}

  @Post('/sendCmd')
  sendCmd(@Body() payload: SendCommandParams) {
    this.logClient.emit('log', payload)
    return this.controlClient.send('sendCmd', payload)
  }

  @Get('/notifications')
  getNotifications() {
    return this.mqttClient.send('notification_channel', "It's a Message From Client")
  }

  @Get('/getVehConResult')
  getVehConResult(@Body() payload: SendCommandParams) {
    this.logClient.emit('log', payload)
    return this.controlClient.send('getVehConResult', payload)
  }

  @Get('/getLatestTracking')
  getLatestTracking(@Query('vin') vin: string) {
    this.logClient.emit('log', vin)
    return this.controlClient.send('getLatestTracking', vin)
  }
}
