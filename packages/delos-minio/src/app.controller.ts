import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { AppService } from './app.service'
import { LocaleData } from './type'

@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @EventPattern('listObjects')
  listObjects(): void {
    this.service.listObjectsV2()
  }

  @EventPattern('update-locale')
  updateLocale(data: LocaleData): void {
    this.service.updateLocale(data)
  }
}
