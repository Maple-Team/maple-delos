import { DeviceOS, DeviceType } from '../types/device';

export class CreateDeviceDto {
  readonly name: string;
  readonly os: DeviceOS;
  readonly size: number;
  readonly PPI: number;
  readonly ratio: string;
  readonly wdp: number;
  readonly wpx: number;
  readonly hdp: number;
  readonly hpx: number;
  readonly dpi: number;
  readonly type: DeviceType;
}
