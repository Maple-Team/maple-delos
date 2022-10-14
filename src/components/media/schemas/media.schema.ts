import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type MediaDocument = Media & Document

@Schema()
export class Media {
  @Prop({ required: true })
  name: string

  @Prop()
  intro: string

  @Prop({ required: true })
  cover: string

  @Prop({ required: true })
  bv_id: string

  @Prop({ required: true })
  duration: number

  @Prop({ required: true })
  pubtime: number

  @Prop({ required: true })
  pubtime2: Date

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  short_link: string

  @Prop({ required: true })
  face: string

  @Prop({ required: true })
  mid: number
}

export const MediaSchema = SchemaFactory.createForClass(Media)
