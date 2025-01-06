import { Controller, Get, Query } from '@nestjs/common'
import { TimelineService } from './timeline.service'
import { Public } from '@/auth/decorators'

@Controller('timeline')
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @Get()
  @Public()
  findWithPagination(@Query() query: { page: number; pageSize: number }) {
    const { page = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(+page, +pageSize, { ...rest })
  }
}
