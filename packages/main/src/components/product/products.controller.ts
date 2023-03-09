import { Controller, Get, Param, Query, UseFilters, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { HttpExceptionFilter } from '../../http-exception.filter'
import { ProductService } from './products.service'

@Controller({
  path: 'products',
  version: 'v1', // controll level
})
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(TransformInterceptor)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  getProducts(@Query() query) {
    const size = +query.size || 10
    const current = +query.page || 1
    return this.service.findWithLimit({ current, size })
  }

  @Get(':id')
  getProduct(@Param('id') id) {
    return this.service.findOne(id)
  }

  // @Post()
  // @HttpCode(200)
  // storePruducts() {
  //   return this.productService.store();
  // }
}
