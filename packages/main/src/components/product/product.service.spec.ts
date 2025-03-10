import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ProductService } from './products.service'

describe('ProductService', () => {
  let service: ProductService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile()

    service = module.get<ProductService>(ProductService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
