import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { MeituluFilterKey, MeituluService } from './meitulu.service'

@Controller('meitulu')
@UseInterceptors(TransformInterceptor)
export class MeituluController {
  constructor(private readonly meituluService: MeituluService) {}

  @Get()
  findWithPagination(@Query() query: { page: number; pageSize: number } & MeituluFilterKey) {
    const { page = 1, pageSize = 10, ...rest } = query
    return this.meituluService.findWithPagination(+page, +pageSize, { ...rest })
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.meituluService.findById(id)
  }

  @Get('tags')
  async findTags() {
    return await this.meituluService.findTags()
  }

  @Get('models')
  async findModels() {
    return await this.meituluService.findModelNames()
  }

  @Get('orgs')
  async findOrgs() {
    return await this.meituluService.findOrgNames()
  }
}
