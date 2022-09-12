import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FictionService } from './fiction.service';
import { CreateFictionDto } from './dto/create-fiction.dto';
import { UpdateFictionDto } from './dto/update-fiction.dto';

@Controller('fiction')
export class FictionController {
  constructor(private readonly fictionService: FictionService) {}

  @Post()
  create(@Body() createFictionDto: CreateFictionDto) {
    return this.fictionService.create(createFictionDto);
  }

  @Get()
  findAll() {
    return this.fictionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fictionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFictionDto: UpdateFictionDto) {
    return this.fictionService.update(+id, updateFictionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fictionService.remove(+id);
  }
}
