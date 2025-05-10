import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { sleep } from '@liutsing/utils'
import { TimelineService } from './timeline.service'
import { CreateTimelineDto } from './dto/create-timeline.dto'
import { Timeline } from './schemas/timeline.schema'
import { UpdateTimelineDto } from './dto/update-timeline.dto'

@Controller('timelines')
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @Get()
  findWithPagination(@Query() query: { current: number; pageSize: number }) {
    const { current = 1, pageSize = 30, ...rest } = query
    return this.service.findWithPagination(current, +pageSize, { ...rest })
  }

  @Delete(':id')
  async deleteById(@Param() params: { id: string }) {
    await sleep(1000 * 1)
    return this.service.deleteById(params.id)
  }

  @Post()
  async create(@Body() createDto: CreateTimelineDto): Promise<Timeline> {
    await sleep(1000 * 1)
    return this.service.create(createDto)
  }

  @Put(':id')
  async update(@Param() params: { id: string }, @Body() updateDto: UpdateTimelineDto) {
    await sleep(1000 * 1)
    return this.service.update(params.id, updateDto)
  }

  @Get(':id')
  async findById(@Param() params: { id: string }) {
    await sleep(1000 * 1)
    return this.service.findById(params.id)
  }
}
