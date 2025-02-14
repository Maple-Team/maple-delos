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
    createdAt: 'created_at', // 自定义字段名
    updatedAt: 'updated_at', // 自定义字段名
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

  // 确保包含自定义的时间戳字段
  obj.createdAt = obj.created_at
  obj.updatedAt = obj.updated_at
  // 删除原始字段
  delete obj.created_at
  delete obj.updated_at
  return obj
}
