import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type MeituluDocument = Meitulu & Document

@Schema({})
export class Meitulu {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  images: string[]

  @Prop({ required: true })
  tags: string[]

  @Prop({ required: true })
  modelName: string[]

  @Prop({ required: true })
  orgName: string
}

export const MeituluSchema = SchemaFactory.createForClass(Meitulu)

MeituluSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id

  return obj
}
