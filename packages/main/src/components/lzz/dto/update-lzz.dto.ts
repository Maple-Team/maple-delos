import { PartialType } from '@nestjs/mapped-types'
import { CreateLzzDto } from './create-lzz.dto'

export class UpdateMeituluDto extends PartialType(CreateLzzDto) {}
