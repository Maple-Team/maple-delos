import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateLocaleDto } from './dto/create-locale.dto'
import { UpdateLocaleDto } from './dto/update-locale.dto'
import { Locale } from './entities/locale.entity'

@Injectable()
export class LocaleService {
  constructor(
    @InjectRepository(Locale)
    private repo: Repository<Locale>
  ) {}

  create(createLocaleDto: CreateLocaleDto) {
    return 'This action adds a new locale'
  }

  findAll() {
    return 'This action returns all locale'
  }

  findOne(id: number) {
    return `This action returns a #${id} locale`
  }

  update(id: number, updateLocaleDto: UpdateLocaleDto) {
    return `This action updates a #${id} locale`
  }

  remove(id: number) {
    return `This action removes a #${id} locale`
  }
}
