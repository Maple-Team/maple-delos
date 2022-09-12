import { Injectable } from '@nestjs/common';
import { CreateFictionDto } from './dto/create-fiction.dto';
import { UpdateFictionDto } from './dto/update-fiction.dto';

@Injectable()
export class FictionService {
  create(createFictionDto: CreateFictionDto) {
    return 'This action adds a new fiction';
  }

  findAll() {
    return `This action returns all fiction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiction`;
  }

  update(id: number, updateFictionDto: UpdateFictionDto) {
    return `This action updates a #${id} fiction`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiction`;
  }
}
