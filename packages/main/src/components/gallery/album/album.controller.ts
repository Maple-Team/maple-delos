import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { AlbumService } from './album.service'

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create() {
    return this.albumService.create()
  }

  @Get()
  findAll() {
    return this.albumService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.albumService.update(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(+id)
  }
}
