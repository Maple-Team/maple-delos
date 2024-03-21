import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { VideoService } from './videos.service'
import { Public } from '@/auth/decorators'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'

@UseInterceptors(TransformInterceptor)
@Controller('videos')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @Get('all')
  @Public()
  findAll() {
    return this.service.findAll()
  }

  @Get('pages')
  @Public()
  findWithPagination(@Query() query: { page: number; pageSize: number }) {
    const { page = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(+page, +pageSize, { ...rest })
  }
}
