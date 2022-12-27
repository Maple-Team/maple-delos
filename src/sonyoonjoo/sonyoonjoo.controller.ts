import { Controller, Get } from '@nestjs/common'
import { SonyoonjooService } from './sonyoonjoo.service'

@Controller('sonyoonjoo')
export class SonyoonjooController {
  constructor(private readonly sonyoonjooService: SonyoonjooService) {}

  @Get()
  findAll() {
    return this.sonyoonjooService.findAll()
  }
}
