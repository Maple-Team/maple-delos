import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { groupBy } from 'lodash'
import type { CreateFictionDto } from './dto/create-fiction.dto'
import { Fiction } from './entities/fiction.entity'

@Injectable()
export class FictionService {
  constructor(
    @InjectRepository(Fiction)
    private repo: Repository<Fiction>
  ) {}

  create(createFictionDto: CreateFictionDto) {
    return this.repo.save(createFictionDto)
  }

  findAll() {
    // return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id })
  }

  async list() {
    const data = await this.repo.find({})
    return groupBy(data, 'bookName')
  }

  update(id: number) {
    return this.repo.update({ id }, {})
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id })
    return this.repo.softRemove(entity)
  }
}
