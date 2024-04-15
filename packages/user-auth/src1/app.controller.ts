import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import type { AppService } from './app.service'

 
@Controller()
export class AppController {
  constructor(private service: AppService) {
    // console.log(service);
  }

  /**
   * 验证token
   * @param text 
   */
  @EventPattern('validate-auth')
  validateAuth(text: unknown): void {
    console.log(JSON.stringify(text))
    // TODO 写到mongoDB
  }

  /**
   * 授权token
   * @param text 
   */
  @EventPattern('fetch-token')
  fetchToken(text: unknown): void {
    console.log(JSON.stringify(text))
    // TODO 写到mongoDB
  }
}
