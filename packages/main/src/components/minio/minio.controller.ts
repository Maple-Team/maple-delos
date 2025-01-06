import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common'
import { MinioService } from './minio.service'
import { Public } from '@/auth/decorators'

@Controller('minio')
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
