import { extname, join } from 'path'
import { tmpdir } from 'os'
import { writeFileSync } from 'fs'
import AppInfoParser from 'app-info-parser'
import { OptionalPick } from '@liutsing/types-utils'
import { FileInterceptor } from '@nestjs/platform-express'
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { AppPlatform } from '@liutsing/enums'
import { uuid } from '@liutsing/utils'
import { ApkParserResult } from '@liutsing/common-types'
import { mkdirSafeSync } from '@liutsing/node-utils'
import { MinioService } from '../minio/minio.service'
import { UpdateAppDto } from './dto/update-app.dto'
import { CreateAppDto } from './dto/create-app.dto'
import { AppService } from './app.service'

type HttpCreateAppDto = OptionalPick<CreateAppDto, 'updateLog' | 'forceUpdate'>
@Controller('apps')
export class AppController {
  constructor(private readonly appService: AppService, private readonly minioService: MinioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createAppDto: HttpCreateAppDto) {
    const { originalname, buffer, mimetype } = file
    // 获取文件扩展名
    const ext = extname(originalname).toLowerCase()

    const tempDir = join(tmpdir(), 'app-uploads')
    mkdirSafeSync(tempDir, { recursive: true })

    // 生成唯一文件名
    const tempFilePath = join(tempDir, `${uuid()}${extname(originalname)}`)

    // 将上传文件写入临时目录
    writeFileSync(tempFilePath, new Uint8Array(buffer.buffer))

    const parser = new AppInfoParser(tempFilePath)

    // 根据文件类型解析元数据
    const metadata: ApkParserResult = await parser.parse()

    const downloadUrl = await this.minioService.updateApp({
      fileName: file.originalname,
      packageName: metadata.package,
      buffer: file.buffer,
      mimetype,
    })

    const iconUrl = await this.minioService.uploadAppIconImage(metadata.icon, metadata.package)

    // 构建数据库实体
    const appEntity: CreateAppDto = {
      appName: metadata.application.label,
      version: metadata.versionName,
      platform: ext === '.apk' ? AppPlatform.ANDROID : AppPlatform.IOS,
      packageName: metadata.package,
      buildNum: metadata.versionCode,
      forceUpdate: false,
      updateLog: createAppDto.updateLog,
      iconUrl,
      downloadUrl,
      packageSize: file.size,
    }

    return this.appService.create(appEntity)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.appService.update(+id, updateAppDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(+id)
  }
}
