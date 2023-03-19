import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private service: AppService) {
    // console.log(service);
  }

  @MessagePattern('sendCmd')
  onSendCmd(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    return `I Got Message From Client: ${data}`;
  }

  @MessagePattern('notification_channel')
  getNotifications2(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    return `I Got Message From Client: ${data}`;
  }
}
