import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Controller({
  path: 'label',
  version: 'v1', // controll level
})
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto);
  }

  @Get()
  @Version('v1') // route level
  findAll() {
    return this.labelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelService.update(+id, updateLabelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labelService.remove(+id);
  }
}
