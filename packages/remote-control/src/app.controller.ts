import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import type {
  SendCommandParams,
  RemoteControlResult,
  VehicleResult,
} from '@liutsing/types-utils';

export class AppController {
  constructor(private service: AppService) {
    // console.log(service);
  }

  @MessagePattern('sendCmd')
  onSendCmd(_params: SendCommandParams) {
    // 返回commandId等信息
    return '123';
  }

  @MessagePattern('getVehConResult')
  onVehConResult(commandId: string): RemoteControlResult {
    // 返回commandId执行的结果
    return {
      vehicleId: '',
      vin: '',
      commandId,
      controlResultList: [
        {
          commandType: '01',
          resultCode: '1',
          resultMsg: '',
          errorDetailCode: '',
          errorDetailMsg: '',
        },
      ],
    };
  }

  @MessagePattern('getLatestTracking')
  onLatestTracking(vin: string): VehicleResult {
    return {
      collectionTime: '',
      deviceStatusData: {
        alarmWhistle: 0,
        locker1: 0,
        locker2: 0,
        majorLight: 0,
        warningLamp: 0,
        audioSerial: '',
        pictureSerial: '',
        remoteCall: '',
        videoSerial: '',
      },
      driveData: {
        drivingState: 1,
      },
      gpsData: {
        gpsAlt: '',
        gpsLat: '',
        gpsLng: '',
        gpsMileage: '',
        turningAngle: '',
        gpsSpeed: '0',
      },
      receiveTime: '',
      terminalCode: '',
      terminalTime: '',
      todayMiles: 0,
      totalMiles: 0,
      vehicleData: {
        batteryTemperature: 0,
        chargeStatus: 0,
        mileage: '',
        motorTemperature: 0,
        soc: '',
        vehicleSpeed: '',
        workStats: 0,
      },
      vehicleId: '',
      vin,
    };
  }
}
