import { Injectable } from '@nestjs/common'
import type { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Album } from './entities/album.entity'

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private repo: Repository<Album>
  ) {}

  create() {
    return 'This action adds a new album'
  }

  findAll() {
    return 'This action returns all album'
  }

  findOne(id: number) {
    return `This action returns a #${id} album`
  }

  update(id: number) {
    return `This action updates a #${id} album`
  }

  remove(id: number) {
    return `This action removes a #${id} album`
  }
}
