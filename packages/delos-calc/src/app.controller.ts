import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor(private service: AppService) {
    console.log(service);
  }

  @MessagePattern('sum')
  sum(numArray: number[]): number {
    return numArray.reduce((p, c) => p + c, 0);
  }

  @Get('/')
  getHello() {
    return this.service.getHello();
  }
}
