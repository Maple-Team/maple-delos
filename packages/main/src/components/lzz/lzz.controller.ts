import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { groupBy } from 'lodash'
import { LzzService } from './lzz.service'

@Controller('lzz')
@UseInterceptors(TransformInterceptor)
export class LzzController {
  constructor(private readonly lzzService: LzzService) {}

  @Get('all')
  async findAll() {
    const data = await this.lzzService.findAll()
    const groupData = groupBy(data, 'date')
    return groupData
  }

  @Get('pages')
  findWithPagination(@Query() query: { current: number; pageSize: number; year?: number; name?: string }) {
    const { current = 1, pageSize = 30 } = query
    return this.lzzService.findWithPagination(+current, +pageSize)
  }

  @Get('detail')
  findById(@Query() query: { id: string }) {
    const { id } = query
    return this.lzzService.findById(id)
  }
}
