import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type SonYoonJooDocument = SonYoonJoo & Document

@Schema({})
export class SonYoonJoo {
  @Prop({ required: true })
  path: string

  @Prop({ required: true })
  date: string

  @Prop({ required: true })
  year: number

  @Prop({ required: true })
  images: string[]

  @Prop({ required: true })
  createdAt: Date
}

export const SonYoonJooSchema = SchemaFactory.createForClass(SonYoonJoo)

SonYoonJooSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  return obj
}
