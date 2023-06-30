import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { DeviceDocument } from './schemas/device.schema'
import { Device } from './schemas/device.schema'
import type { CreateDeviceDto } from './dto/create-device.dto'

@Injectable()
export class DeviceService {
  constructor(@InjectModel(Device.name) private DeviceModel: Model<DeviceDocument>) {}

  async create(createDto: CreateDeviceDto): Promise<Device> {
    const createdDevice = new this.DeviceModel(createDto)
    return createdDevice.save()
  }

  async findAll(): Promise<Device[]> {
    return this.DeviceModel.find().exec()
  }

  async remove(id: string) {
    return this.DeviceModel.findByIdAndRemove(id)
  }

  async insertMany(data: Device[]) {
    return this.DeviceModel.insertMany(data)
  }
}
