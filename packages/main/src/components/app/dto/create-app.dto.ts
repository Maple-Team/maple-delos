import { AppPlatform } from '@liutsing/enums'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator'

export class CreateAppDto {
  @ApiProperty({ description: 'app包名', example: 'xxxx' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  appName: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  version: string

  @IsEnum(AppPlatform)
  platform: AppPlatform

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  packageName: string

  @IsInt()
  @Min(1)
  buildNum: number

  @IsUrl()
  @IsOptional()
  downloadUrl?: string

  @IsUrl()
  @IsOptional()
  iconUrl?: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  updateLog?: string

  @IsBoolean()
  @IsOptional()
  forceUpdate: boolean

  @IsInt()
  @IsNotEmpty()
  packageSize: number
}
