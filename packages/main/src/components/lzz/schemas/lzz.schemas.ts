import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type LzzDocument = Lzz & Document

@Schema({ collection: 'lzz' })
export class Lzz {
  @Prop({ required: true })
  year: number

  @Prop({ required: true })
  date: string

  @Prop({ required: true })
  time: string[]
}

export const LzzSchema = SchemaFactory.createForClass(Lzz)

LzzSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}
