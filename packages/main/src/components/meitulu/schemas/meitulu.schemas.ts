import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

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
