import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common'
import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { SendCommandParams } from '@liutsing/types-utils'

@Controller('vehicle-control')
export class ControlController {
  constructor(
    @Inject('REMOTE_CONTROL_SERVICE') private controlClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
    @Inject('PHP_SERVICE') private phpClient: ClientProxy
  ) {}

  @Post('/sendCmd')
  @HttpCode(200)
  sendCmd(@Body() payload: SendCommandParams) {
    this.logClient.emit('log', payload)
    return this.controlClient.send('sendCmd', payload)
  }

  @Get('/mqtt-test')
  test() {
    return this.mqttClient.send('mqtt-test', `It's a Message From Client: ${new Date().toLocaleTimeString()}`)
  }

  @Get('/getVehConResult')
  getVehConResult(@Query('commandId') commandId: string) {
    if (!commandId) throw new Error('commandId not be null')

    this.logClient.emit('log', commandId)
    // 微服务不在线会报错
    return this.controlClient.send('getVehConResult', commandId)
  }

  @MessagePattern('greeting')
  async onGreeting(params: AnyToFix) {
    // this.phpClient.emit('')
    return params
  }
}
