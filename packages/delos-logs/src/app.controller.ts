import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

/**
 * TODO
 * 1. log test
 * 2. user request log
 * 3. business analysis
 * 4. form body log
 */
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
