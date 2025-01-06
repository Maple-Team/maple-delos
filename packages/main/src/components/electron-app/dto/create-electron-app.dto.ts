import { IsNotEmpty, Matches } from 'class-validator'

export class CreateElectronAppDto {
  // TODO 国际化处理
  // 没走这个校验逻辑
  @IsNotEmpty({ message: 'name字段不能为空', always: true })
  readonly name: string

  @Matches(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(beta|alpha)(?:\d*))?$/)
  readonly version: string

  @IsNotEmpty()
  readonly versionCode: number

  @IsNotEmpty()
  readonly description: string

  readonly remark: string
  @IsNotEmpty()
  readonly releaseDate: Date

  @IsNotEmpty()
  readonly pubDate: Date

  @IsNotEmpty()
  /**
   * 新版本安装包的下载链接
   */
  readonly url: string

  @IsNotEmpty()
  readonly path: string
}
// "version": "2.0.0",
// "releaseDate": "2024-06-01",
// "notes": "This is the release notes for version 2.0.0.",
// "pub_date": 1677755600,
// "url": "https://example.com/downloads",
// "path": "/myapp-2.0.0.exe",
// "name": "MyAppSetup-2.0.0"
