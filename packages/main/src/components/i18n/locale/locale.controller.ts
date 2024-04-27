import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { LocaleService } from './locale.service'
import { CreateLocaleDto } from './dto/create-locale.dto'
import { UpdateLocaleDto } from './dto/update-locale.dto'

@Controller('locale')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Post()
  create(@Body() createLocaleDto: CreateLocaleDto) {
    return this.localeService.create(createLocaleDto)
  }

  @Get()
  findAll() {
    return this.localeService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localeService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocaleDto: UpdateLocaleDto) {
    return this.localeService.update(+id, updateLocaleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localeService.remove(+id)
  }
}
