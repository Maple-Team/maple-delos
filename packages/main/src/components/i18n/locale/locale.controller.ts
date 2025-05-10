import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { BaseParams } from '@liutsing/types-utils'
import { LocaleService } from './locale.service'
import { CreateLocaleDto, UpdateLocaleWithScreenShotsDto } from './dto/create-locale.dto'
import { UpdateLocaleDto } from './dto/update-locale.dto'
import { Locale } from './entities/locale.entity'
import { Public } from '@/auth/decorators'

@Controller('/i18n/locale')
export class LocaleController {
  constructor(private readonly service: LocaleService) {}

  @Post()
  create(@Body() createLocaleDto: CreateLocaleDto) {
    return this.service.create(createLocaleDto)
  }

  /**
   * 分页查询
   * @param query
   * @returns
   */
  @Public()
  @Get('pages')
  findWithPagination(@Query() query) {
    const { current = 1, pageSize = 10, ...rest } = query as BaseParams<Locale>
    return this.service.findMany({
      current: +current,
      pageSize: +pageSize,
      ...rest,
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  /**
   * 按id更新
   * @param id
   * @param updateLocaleDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocaleDto: UpdateLocaleDto) {
    return this.service.update(+id, updateLocaleDto)
  }

  /**
   * 按id删除
   * @param id
   * @returns
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }

  /**
   * 批量创建
   * @param createLocaleDtoArray
   * @returns
   */
  @Public()
  @Post('batch')
  batchCreate(@Body() createLocaleDtoArray: CreateLocaleDto[]) {
    if (!createLocaleDtoArray || createLocaleDtoArray.length === 0)
      throw new BadRequestException('body should not be null')
    return this.service.batchCreate(createLocaleDtoArray)
  }

  /**
   * 批量更新词条与截图的关系(chrome插件用)
   * @param dtoArray
   * @returns
   */
  @Public()
  @Post('batchWithScreenShots')
  batchCreateWithScreenShots(@Body() dtoArray: UpdateLocaleWithScreenShotsDto[]) {
    return this.service.batchCreateWithScreenShots(dtoArray)
  }
}
