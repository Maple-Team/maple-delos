import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type BlogDocument = Blog & Document
@Schema({ timestamps: true, collection: '曾咏春博文' })
export class Blog {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  reads: number

  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  date: string

  @Prop({ required: true })
  url: string

  @Prop({ required: true })
  isRecommend: boolean
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

BlogSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  return obj
}
