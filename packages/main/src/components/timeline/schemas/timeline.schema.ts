import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type TimelineDocument = Timeline & Document

export interface ITimeline {
  content: string
  date: string
  time: string
  type: 'timeline' | 'treehole'
  ts: number
  id?: string
}

@Schema({})
export class Timeline implements ITimeline {
  @Prop({ required: false })
  id?: string

  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  date: string

  @Prop({ required: true })
  time: string

  @Prop({ required: true })
  type: 'timeline' | 'treehole'

  @Prop({ required: true })
  ts: number
}

export const TimelineSchema = SchemaFactory.createForClass(Timeline)

TimelineSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  return obj
}
