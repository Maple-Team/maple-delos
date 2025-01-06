import { Controller } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { AppService } from './app.service'
import { LocaleData } from './type'

@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @EventPattern('list-objects')
  listObjects(data: { bucketName: string }): void {
    console.log(data, 'data.bucketName')
    this.service.listObjectsV2(data.bucketName)
  }

  @EventPattern('update-locale')
  updateLocale(data: LocaleData): void {
    this.service.updateLocale(data)
  }

  @EventPattern('upload-locale-image')
  uploadLocaleImage(data: string) {
    return this.service.uploadLocaleImage(data)
  }
}
