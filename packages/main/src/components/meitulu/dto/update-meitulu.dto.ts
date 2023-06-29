import { PartialType } from '@nestjs/mapped-types'
import { CreateMeituluDto } from './create-meitulu.dto'

export class UpdateMeituluDto extends PartialType(CreateMeituluDto) {}
