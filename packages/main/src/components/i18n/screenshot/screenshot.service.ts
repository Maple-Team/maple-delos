import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Screenshots } from './entities'

@Injectable()
export class ScreenshotService {
  constructor(
    @InjectRepository(Screenshots)
    private repo: Repository<Screenshots>
  ) {}
}
