import { BadRequestException, Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import { MinioService } from './minio.service'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { Public } from '@/auth/decorators'
import { LocaleData } from '@/type'

@Controller('minio')
@UseInterceptors(TransformInterceptor)
export class MinioController {
  constructor(private readonly service: MinioService) {}

  @Public()
  @Get('/list-objects')
  listObjects() {
    return this.service.listObjects()
  }

  @Public()
  @Post('/update-locale')
  updateLocale(@Body() data: LocaleData) {
    if (!data || Object.keys(data).length === 0) throw new BadRequestException('body should not be null')
    return this.service.updateLocale(data)
  }
}
