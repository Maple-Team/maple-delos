import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document, SchemaTimestampsConfig } from 'mongoose'
import { TimelineEnum } from '../dto/create-timeline.dto'

export type TimelineDocument = Timeline & Document & SchemaTimestampsConfig

export interface ITimeline {
  content: string
  type: 'timeline' | 'treehole'
  id?: string
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Timeline implements ITimeline {
  @Prop({ required: false })
  id?: string

  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  type: TimelineEnum
}

export const TimelineSchema = SchemaFactory.createForClass(Timeline)

TimelineSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  return obj
}
