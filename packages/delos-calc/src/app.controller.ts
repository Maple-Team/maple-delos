import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
@Controller()
export class AppController {
  constructor() {
    //
  }

  @MessagePattern('sum')
  sum(numArray: number[]): number {
    return numArray.reduce((p, c) => p + c, 0);
  }
}
