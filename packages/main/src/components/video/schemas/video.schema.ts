import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type VideoDocument = Video & Document
export type ActressDocument = Actress & Document

@Schema({ collection: 'actresses' })
export class Actress {
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
/**
  title: string;
  code: string;
  actresses: string[];
  tags?: string[];
  series?: string;
  date?: string;
  previews?: string[];
  cover?: string;
  thumb?: string;
  director?: string;
 */
@Schema({ collection: 'adult-videos' })
export class Video {
  @Prop({ required: true })
  title: string

  @Prop({ required: true, index: true })
  code: string

  @Prop({ required: true })
  no: string

  @Prop({ required: true })
  actresses: Actress[]

  /** 标签 */
  @Prop({ required: false })
  tags: string[]

  @Prop({ required: false })
  comments: string

  @Prop({ required: true })
  releaseDate: Date

  /** 预览图 */
  @Prop({ required: false })
  previews: string[]

  @Prop({ required: true })
  cover: string

  @Prop({ required: false })
  series: string

  @Prop({ required: true })
  director: string

  @Prop({ required: false })
  waiting: boolean
}

export const VideoSchema = SchemaFactory.createForClass(Video)
export const ActressSchema = SchemaFactory.createForClass(Actress)
