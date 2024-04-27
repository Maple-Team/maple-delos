import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type VideoDocument = Video & Document
export type ActressDocument = Actress & Document

@Schema({ collection: 'actresses' })
export class Actress {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  avatar: string
}

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

  @Prop({ required: false })
  tages: string[]

  @Prop({ required: false })
  comments: string

  @Prop({ required: true })
  date: string

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

  @Prop({ required: true, type: 'Number' })
  relaseDate: Date

  @Prop({ required: false })
  previewes: string[]
}

export const VideoSchema = SchemaFactory.createForClass(Video)
export const ActressSchema = SchemaFactory.createForClass(Actress)
