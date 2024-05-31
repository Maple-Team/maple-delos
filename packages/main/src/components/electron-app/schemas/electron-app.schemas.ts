import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type ElectronAppDocument = ElectronApp & Document

@Schema({ collection: 'electron-app' })
export class ElectronApp {
  // FIXME 定制化校验错误信息
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  version: string

  @Prop({ required: true })
  versionCode: number

  @Prop({ required: true })
  readonly description: string

  @Prop({})
  readonly remark: string

  @Prop({ required: true })
  readonly releaseDate: Date

  @Prop({ required: true })
  readonly buildDate: Date

  @Prop({ required: true })
  /**
   * 新版本安装包的下载链接
   */
  readonly url: string

  @Prop({ required: true })
  readonly path: string
}

export const ElectronAppSchema = SchemaFactory.createForClass(ElectronApp)
// TODO 多字段组成唯一值
