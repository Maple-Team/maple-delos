import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { LabelService } from './label.service'
import type { CreateLabelDto } from './dto/create-label.dto'

@UseInterceptors(TransformInterceptor)
@Controller({
  path: 'label',
  version: 'v1',
})
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto)
  }

  @Get('all')
  findAll() {
    return this.labelService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labelService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.labelService.update(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labelService.remove(+id)
  }
}
