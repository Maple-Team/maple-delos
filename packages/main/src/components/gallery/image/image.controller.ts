import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ImageService } from './image.service'

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create() {
    return this.imageService.create()
  }

  @Get()
  findAll() {
    return this.imageService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.imageService.update(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id)
  }
}
