import { ApiProperty } from '@nestjs/swagger'
// import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export enum TimelineEnum {
  timeline = 'timeline',
  treehole = 'treehole',
}
// @IsIn(["a","b"])
// NOTE 自定义验证器
// @https://juejin.cn/post/7342319793154441231

export class CreateTimelineDto {
  @ApiProperty({ description: '树洞内容', example: 'xxxx' })
  @IsNotEmpty({ message: '树洞内容不能为空' })
  @IsString({ message: '树洞内容必须是字符串' })
  content: string

  @ApiProperty({ description: '树洞类型', example: 'timeline', enum: TimelineEnum })
  @IsNotEmpty({ message: '树洞类型不能为空' })
  @IsEnum(TimelineEnum, { message: '树洞类型必须是 timeline 或 treehole' })
  type: TimelineEnum
}
