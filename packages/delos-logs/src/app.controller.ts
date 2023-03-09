import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {
    //
  }

  @EventPattern('log')
  log(text: string): void {
    console.log(text);
  }
}
