import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { TimelineService } from './timeline.service'
import { CreateTimelineDto } from './dto/create-timeline.dto'
import { Timeline } from './schemas/timeline.schema'
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

  @Post()
  @Public()
  create(@Body() createDto: CreateTimelineDto): Promise<Timeline> {
    return this.service.create(createDto)
  }
}
