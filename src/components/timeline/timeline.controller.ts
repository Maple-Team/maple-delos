import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { TimelineService } from './timeline.service'

@Controller('timeline')
@UseInterceptors(TransformInterceptor)
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @Get()
  findWithPagination(@Query() query: { page: number; pageSize: number }) {
    const { page = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(+page, +pageSize, { ...rest })
  }
}
