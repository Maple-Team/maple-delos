import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private service: AppService) {
    // console.log(service);
  }

  @MessagePattern('send-cmd')
  onSendCmd(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    return `I Got Message From Client: ${data}`;
  }

  @MessagePattern('mqtt-test')
  onTest(@Payload() data: number[], @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    return `I Got Message From Client: ${data}`;
  }
}
