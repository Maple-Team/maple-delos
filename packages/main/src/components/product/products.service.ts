import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { BaseList } from '@liutsing/types-utils'
import { Product } from './product.entity'
// import  productData from './dummy.json';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>
  ) {}

  async findWithLimit({ current, size }: { current: number; size: number }): Promise<BaseList<Product>> {
    const [total, records] = await Promise.all([
      this.productsRepository.count(),
      this.productsRepository.find({
        take: size,
        skip: current - 1,
      }),
    ])
    return {
      pagination: {
        total,
        current,
        pageSize: size,
      },
      records,
    }
  }

  findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id })
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id)
  }
  // store(): Promise<InsertResult> {
  //   const productData2 = productData.map(({ id, images, ...rest }) => ({
  //     images: images.join(','),
  //     ...rest,
  //   }));
  //   return this.productsRepository.insert(productData2);
  // }

  getList(): string[] {
    return []
  }
}
