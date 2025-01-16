import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { VideoService } from './videos.service'
import { Video } from './schemas/video.schema'
import { Actress } from './schemas/actress.schema'
import { Public } from '@/auth/decorators'

@Public()
@Controller('videos')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @Get('all')
  findAll() {
    return this.service.findAll().then((res) => res.sort())
  }

  @Post('add')
  add(@Body() data: Partial<Video>) {
    if (!data) throw new BadRequestException('empty data')
    if (!data.code) throw new BadRequestException('empty id')
    return this.service.add(data)
  }

  @Get('pages')
  findWithPagination(@Query() query: { page: number; pageSize: number }) {
    const { page = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(+page, +pageSize, { ...rest })
  }

  @Post('batch-add')
  async batchAdd(@Body() data: Partial<Video[]>) {
    if (!data || isEmpty(data)) throw new BadRequestException('empty request body')
    return this.service.batchAdd(data)
  }

  @Get('actresses')
  getAllActresses(@Query() query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 30 } = query
    return this.service.getAllActresses(+page, +pageSize)
  }

  @Get('distinct-actresses')
  getAllDistinctActresses() {
    return this.service.getAllDistinctActresses()
  }

  @Post('actresses-batch-add')
  async batchAddActress(@Body() data: Partial<Actress[]>): Promise<AnyToFix> {
    if (!data || isEmpty(data)) throw new BadRequestException('empty request body')
    return this.service.batchAddActress(data)
  }

  // NOTE 保持在最后
  @Get(':code')
  info(@Param() { code }: { code: string }) {
    if (!code) throw new BadRequestException('wrong parameters')
    return this.service.findByCode(code)
  }
}
