import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blogDto'

@Controller('zyc-blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get('/all')
  findAll() {
    return this.service.findAll()
  }

  @Get()
  findWithLimit(@Query() query) {
    const { current = 1, pageSize = 10, ...rest } = query
    return this.service.findWithLimit({ current: +current, size: +pageSize, ...rest })
  }

  @Post('/add')
  add() {
    //
  }

  @Post('/batch')
  insertMany(@Body() body: CreateBlogDto[]) {
    return this.service.insertMany(body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.service.remove(id)
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.findById(id)
  }

  @Get('nav/:id')
  async findPrevAndNext(@Param('id') id: string) {
    return await this.service.findPrevAndNext(id)
  }

  @Get('category/all')
  async category() {
    return await this.service.fetchCategory()
  }
}
