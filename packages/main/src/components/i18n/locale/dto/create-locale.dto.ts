import { IsNotEmpty } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

export class CreateLocaleDto {
@IsNotEmpty()
  readonly key: string
  readonly zhCN: string
  readonly zhHK: string
  readonly enUS: string
}

export class UpdateLocaleWithScreenShotsDto extends PartialType(CreateLocaleDto){
    readonly id:number
    readonly projectName:string
    readonly screenShotIDs: number[]
}