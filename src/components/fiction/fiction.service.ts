import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFictionDto } from './dto/create-fiction.dto';
import { UpdateFictionDto } from './dto/update-fiction.dto';
import { Fiction } from './entities/fiction.entity';

@Injectable()
export class FictionService {
  constructor(
    @InjectRepository(Fiction)
    private repo: Repository<Fiction>,
  ) {}
  create(createFictionDto: CreateFictionDto) {
    return this.repo.save(createFictionDto);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  update(id: number, updateFictionDto: UpdateFictionDto) {
    return this.repo.update({ id }, updateFictionDto);
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id });
    return this.repo.softRemove(entity);
  }
}
