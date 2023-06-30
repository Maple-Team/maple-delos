import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Image } from './entities/image.entity'

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private repo: Repository<Image>
  ) {}

  create() {
    return 'This action adds a new image'
  }

  findAll() {
    return 'This action returns all image'
  }

  findOne(id: number) {
    return `This action returns a #${id} image`
  }

  update(id: number) {
    return `This action updates a #${id} image`
  }

  remove(id: number) {
    return `This action removes a #${id} image`
  }
}
