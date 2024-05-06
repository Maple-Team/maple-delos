import { IsNotEmpty } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateLocaleDto {
  @IsNotEmpty()
  readonly key: string

  @IsNotEmpty()
  readonly zhCN: string

  @IsNotEmpty()
  readonly zhHK: string

  @IsNotEmpty()
  readonly enUS: string

  @IsNotEmpty()
  readonly project: string

  readonly screenShotId: number
}

export class UpdateLocaleWithScreenShotsDto extends PartialType(CreateLocaleDto) {
  readonly id: number
  readonly screenShotIDs: number[]
}
