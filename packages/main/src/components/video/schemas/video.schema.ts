import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Date, Document } from 'mongoose'

export type VideoDocument = Video & Document
interface Actress {
  name: string
  avatar: string
}

@Schema({})
export class Video {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  no: string

  @Prop({ required: true })
  actresses: Actress[]

  @Prop({ required: false })
  tages: string[]

  @Prop({ required: false })
  comments: string

  @Prop({ required: true, type: 'Number' })
  relaseDate: Date

  @Prop({ required: false })
  previewes: string[]

  @Prop({ required: true })
  cover: string
}

export const VideoSchema = SchemaFactory.createForClass(Video)
