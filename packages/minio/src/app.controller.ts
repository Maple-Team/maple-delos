import { Buffer } from 'buffer'
import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
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

  @EventPattern('upload-proxy')
  uploadProxy(@Payload() payload) {
    let data = payload.buffer
    const contentType = payload.contentType
    // 检查 payload 是否为 Buffer 对象的序列化形式
    if (payload.buffer.type === 'Buffer') data = Buffer.from(payload.buffer.data)

    return this.service.uploadProxy(data, contentType)
  }

  @EventPattern('get-proxy')
  getProxy(@Payload() filePath) {
    return this.service.getProxy(filePath)
  }

  @EventPattern('upload-app')
  async uploadApp(
    @Payload()
    {
      buffer,
      fileName,
      packageName,
      mimetype,
    }: {
      fileName: string
      packageName: string
      buffer: { type: 'Buffer'; data: Uint8Array }
      mimetype: string
    }
  ) {
    const data = Buffer.from(buffer.data)
    // 调用服务层方法上传APK，指定MIME类型
    return this.service.uploadApp(data, packageName, fileName, mimetype)
  }

  @EventPattern('upload-app-icon-image')
  uploadAppIconImage(@Payload() { data, packageName }: { data: string; packageName: string }) {
    return this.service.uploadAppIconImage(data, packageName).catch((e) => {
      throw e
    })
  }
}
