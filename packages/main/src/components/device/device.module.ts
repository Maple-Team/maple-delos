import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { Device, DeviceSchema } from './schemas/device.schema'

@Module({
  providers: [DeviceService],
  controllers: [DeviceController],
  imports: [MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])],
})
export class DeviceModule {}
