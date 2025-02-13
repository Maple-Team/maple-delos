import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { TimelineService } from './timeline.service'
import { Public } from '@/auth/decorators'

@Controller('timeline')
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @Get()
  @Public()
  findWithPagination(@Query() query: { current: number; pageSize: number }) {
    const { current = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(current, +pageSize, { ...rest })
  }

  @Delete(':id')
  @Public()
  deleteById(@Param() params: { id: string }) {
    return this.service.deleteById(params.id)
  }
}
