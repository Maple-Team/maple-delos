import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from './schemas/device.schema';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  async create(createDto: CreateDeviceDto): Promise<Device> {
    const createdDevice = new this.deviceModel(createDto);
    return createdDevice.save();
  }

  async findAll(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }
  async softDelete() {
    return this.deviceModel.findOneAndRemove();
  }
}
