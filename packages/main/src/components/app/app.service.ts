import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAppDto } from './dto/create-app.dto'
import { UpdateAppDto } from './dto/update-app.dto'
import { App } from './entities/app.entity'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App)
    private repo: Repository<App>
  ) {}

  create(createAppDto: CreateAppDto) {
    return this.repo.save(createAppDto)
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id })
  }

  update(id: number, updateAppDto: UpdateAppDto) {
    return this.repo.update({ id }, updateAppDto)
  }

  remove(id: number) {
    return this.repo.delete({ id })
  }
}
