import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private repository: Repository<Label>,
  ) {}

  async create(createLabelDto: CreateLabelDto) {
    return this.repository.save(createLabelDto);
  }
  async batchCreate(labels: CreateLabelDto[]) {
    return this.repository.insert(labels);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id: `${id}` });
  }

  update(id: number, updateLabelDto: UpdateLabelDto) {
    return `This action updates a #${id} label`;
  }

  remove(id: number) {
    return `This action removes a #${id} label`;
  }
}
