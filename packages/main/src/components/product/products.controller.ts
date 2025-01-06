import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductService } from './products.service'

@Controller({
  path: 'products',
  version: 'v1', // controll level
})
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
  // storeProducts() {
  //   return this.productService.store();
  // }
}
