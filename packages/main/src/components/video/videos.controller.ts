import { BadRequestException, Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common'
import { VideoService } from './videos.service'
import { Video } from './schemas/video.schema'
import { Public } from '@/auth/decorators'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'

@UseInterceptors(TransformInterceptor)
@Controller('videos')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @Get('all')
  @Public()
  findAll() {
    return this.service.findAll().then((res) => res.map(({ code }) => code).sort())
  }

  @Post('add')
  @Public()
  add(@Body() data: Partial<Video>) {
    if (!data) throw new BadRequestException('empty data')
    if (!data.code) throw new BadRequestException('empty id')
    return this.service.add(data)
  }

  @Get('pages')
  @Public()
  findWithPagination(@Query() query: { page: number; pageSize: number }) {
    const { page = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(+page, +pageSize, { ...rest })
  }
}
