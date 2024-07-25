import { Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { groupBy } from 'lodash'
import { LzzService } from './lzz.service'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { Public } from '@/auth/decorators'

@Controller('lzz')
@UseInterceptors(TransformInterceptor)
export class LzzController {
  constructor(private readonly lzzService: LzzService) {}

  @Public()
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

  @Public()
  @Get('test')
  test() {
    return 'ok'
  }
}
