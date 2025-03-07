import { Controller, Get, Param, Query } from '@nestjs/common'
import { SonyoonjooService } from './sonyoonjoo.service'
import { Public } from '@/auth/decorators'

@Public()
@Controller('sonyoonjoo')
export class SonyoonjooController {
  constructor(private readonly sonyoonjooService: SonyoonjooService) {}

  @Get()
  findWithPagination(@Query() query: { page: number; pageSize: number; year?: number; name?: string }) {
    const { page = 1, pageSize = 10, ...rest } = query
    return this.sonyoonjooService.findWithPagination(+page, +pageSize, { ...rest })
  }

  @Get('/category/years')
  years() {
    return this.sonyoonjooService.fetchYears()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.sonyoonjooService.findById(id)
  }

  @Get('nav/:id')
  async findPrevAndNext(@Param('id') id: string) {
    return await this.sonyoonjooService.findPrevAndNext(id)
  }
}
