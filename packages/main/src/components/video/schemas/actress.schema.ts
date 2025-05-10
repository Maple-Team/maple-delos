import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { Document } from 'mongoose'

export type ActressDocument = Actress & Document

export interface IActress {
  name: string
  avatar?: string
  birthDay?: Date
  height?: number
  url?: string
}

@Schema({
  collection: 'adult-actresses',
  _id: false,
  id: true,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Actress implements IActress {
  /** 姓名 */
  @Prop({ required: true })
  name: string

  /** 头像 */
  @Prop({ required: false })
  avatar: string

  /** 出生日期 */
  @Prop({ required: false })
  birthDay: Date

  /** 身高 */
  @Prop({ required: false })
  height: number

  /** href */
  @Prop({ required: false })
  url: string
}

export const ActressSchema = SchemaFactory.createForClass<IActress>(Actress)

ActressSchema.methods.toJSON = function () {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  return obj
}
