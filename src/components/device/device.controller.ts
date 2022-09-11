import { Controller, Delete, Get, Post } from '@nestjs/common';
import { DeviceService } from './device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('/all')
  findAll() {
    return this.deviceService.findAll();
  }
  @Post('/')
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
    });
  }
  @Delete()
  async remove() {
    const deleted = await this.deviceService.softDelete();
    return deleted;
  }
}
