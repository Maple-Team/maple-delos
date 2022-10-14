import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { DeviceService } from './device.service'
import { CreateDeviceDto } from './dto/create-device.dto'

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('/all')
  findAll() {
    return this.deviceService.findAll()
  }

  @Post('/add')
  add() {
    return this.deviceService.create({
      name: 'iPhone X',
      os: 'iOS',
      size: 5.8,
      PPI: 458,
      ratio: '19:9',
      wdp: 375,
      hdp: 812,
      wpx: 1125,
      hpx: 2436,
      dpi: 3.0,
      type: 'Phone',
    })
  }

  @Post('/batch')
  insertMany(@Body() body: CreateDeviceDto[]) {
    return this.deviceService.insertMany(body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.deviceService.remove(id)
    return deleted
  }
}
