import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeviceOS, DeviceType } from '../types/device';

export type DeviceDocument = Device & Document;
@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  os: DeviceOS;
  @Prop({ required: true })
  size: number;
  @Prop({ required: true })
  PPI: number;
  @Prop({ required: true })
  ratio: string;
  @Prop({ required: true })
  wdp: number;
  @Prop({ required: true })
  hdp: number;
  @Prop({ required: true })
  wpx: number;
  @Prop({ required: true })
  hpx: number;
  @Prop({ required: true })
  dpi: number;
  @Prop({ required: true })
  type: DeviceType;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
