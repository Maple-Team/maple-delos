import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private service: AppService) {
    // console.log(service);
  }

  @EventPattern('log')
  log(text: unknown): void {
    console.log(JSON.stringify(text));
    //TODO 写到mongoDB
  }
}
