import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type VideoDocument = Video & Document
export type ActressDocument = Actress & Document

export interface IActress {
  name: string
  avatar?: string
  birthDay?: Date
  height?: number
}

@Schema({ collection: 'actresses' })
export class Actress implements IActress {
  /** 姓名 */
  @Prop({ required: true })
  name: string

  /** 头像 */
  @Prop({ required: false })
  avatar: string

  /** 出生日期 */
  @Prop({ required: false })
  birthDay: Date

  /** 身高 */
  @Prop({ required: false })
  height: number
}

@Schema({ collection: 'adult-videos' })
export class Video implements IVideo {
  @Prop({ required: true })
  title: string

  @Prop({ required: false })
  enTitle: string

  @Prop({ required: true, index: true })
  code: string

  @Prop({ required: true })
  actresses: string[]

  @Prop({ required: false })
  tags: string[]

  @Prop({ required: false })
  comments: string

  @Prop({ required: false })
  releaseDate: Date

  /** 预览图 */
  @Prop({ required: false })
  previews: string[]

  /** 小图 */
  @Prop({ required: false })
  thumb: string

  @Prop({ required: false })
  cover: string

  @Prop({ required: false })
  series: string

  @Prop({ required: false })
  director: string

  @Prop({ required: false })
  hasVideo: boolean

  @Prop({ required: false })
  hasPreview: boolean

  @Prop({ required: false })
  hasDetail: boolean
  // FIXME 时间戳
}

export interface IVideo {
  title: string
  enTitle?: string
  code: string
  actresses: string[]
  tags?: string[]
  series?: string
  releaseDate?: Date
  previews?: string[]
  cover?: string
  thumb?: string
  director?: string
  comments?: string

  hasVideo?: boolean // 是否有视频
  hasPreview?: boolean // 是否有预览图
  hasDetail?: boolean // 是否有详细数据
}

export const VideoSchema = SchemaFactory.createForClass<IVideo>(Video)
export const ActressSchema = SchemaFactory.createForClass<IActress>(Actress)

// @https://docs.nestjs.com/techniques/mongodb
// FIXME hook
VideoSchema.post('save', (doc: VideoDocument) => {
  console.log('post save:', {
    thumb: doc.thumb,
    previews: doc.previews,
    cover: doc.cover,
  })
})
