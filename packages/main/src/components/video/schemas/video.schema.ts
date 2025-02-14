import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type VideoDocument = Video & Document

// https://wdk-docs.github.io/nest-docs/techniques/mongo/#_8
// https://docs.nestjs.com/techniques/mongodb

@Schema({
  collection: 'adult-videos',
  _id: false,
  id: true,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Video implements IVideo {
  @Prop({ required: true })
  title: string

  @Prop({ required: false })
  enTitle: string

  @Prop({
    required: true,
    index: true,
    unique: true,
    uppercase: true,
    lowercase: false,
  })
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
VideoSchema.index({ code: 1 }, { unique: true })

VideoSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  return obj
}
