import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { SonyoonjooService } from './sonyoonjoo.service'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { Public } from '@/auth/decorators'

@Controller('sonyoonjoo')
@UseInterceptors(TransformInterceptor)
export class SonyoonjooController {
  constructor(private readonly sonyoonjooService: SonyoonjooService) {}

  @Get()
  @Public()
  findWithPagination(@Query() query: { page: number; pageSize: number; year?: number; name?: string }) {
    const { page = 1, pageSize = 10, ...rest } = query
    return this.sonyoonjooService.findWithPagination(+page, +pageSize, { ...rest })
  }

  @Get('/category/years')
  @Public()
  years() {
    return this.sonyoonjooService.fetchYears()
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    return await this.sonyoonjooService.findById(id)
  }

  @Get('nav/:id')
  @Public()
  async findPrevAndNext(@Param('id') id: string) {
    return await this.sonyoonjooService.findPrevAndNext(id)
  }
}
