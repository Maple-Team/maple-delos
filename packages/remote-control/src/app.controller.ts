import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import type {
  SendCommandParams,
  RemoteControlResult,
  VehicleResult,
  ControlExecuteCode,
} from '@liutsing/types-utils';
import snowflakeId from 'snowflake-id';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
type RtInfo = VehicleResult['deviceStatusData'] & VehicleResult['driveData'];
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
  ) {}

  @MessagePattern('sendCmd')
  async onSendCmd(params: SendCommandParams) {
    // mock to PUSH TO DEVICE
    console.log(params);
    this.logClient.emit('log', JSON.stringify(params));
    const { vin, instructionDtoList } = params;
    const key = `rc_cmd_${vin}`;
    const commandId = snowflakeId();
    await this.cacheService.store.set(key, params);
    await this.cacheService.set(commandId, vin);
    const resultKey = `rc_result_${commandId}`;
    const executeCode: ControlExecuteCode = '1'; // <------ // NOTE MOCK THIS
    await this.cacheService.set(resultKey, executeCode);

    setTimeout(async () => {
      const resultCode = (await this.cacheService.get(
        resultKey,
      )) as ControlExecuteCode;
      const ret: RemoteControlResult = {
        vehicleId: snowflakeId(),
        vin,
        commandId,
        controlResultList: [
          {
            commandType: instructionDtoList[0].commandType,
            resultCode,
            resultMsg: '',
            errorDetailCode: '',
            errorDetailMsg: '',
          },
        ],
      };
      this.mqttClient.send('topic-ecar-remote-control', JSON.stringify(ret));
    }, 5 * 1000);
    return commandId;
  }

  @MessagePattern('getVehConResult')
  async onVehConResult(commandId: string): Promise<RemoteControlResult> {
    // 返回commandId执行的结果
    const vin = (await this.cacheService.get(commandId)) as string;
    const key = `rc_cmd_${vin}`;
    const params = (await this.cacheService.store.get(
      key,
    )) as SendCommandParams;
    const resultKey = `rc_result_${commandId}`;
    const resultCode = (await this.cacheService.get(
      resultKey,
    )) as ControlExecuteCode; // <------ // NOTE MOCK THIS

    return {
      vehicleId: snowflakeId(),
      vin,
      commandId,
      controlResultList: [
        {
          commandType: params.instructionDtoList[0].commandType,
          resultCode,
          resultMsg: '',
          errorDetailCode: '',
          errorDetailMsg: '',
        },
      ],
    };
  }

  // TODO after ws connect to invoke ws send rt message
  @MessagePattern('getLatestTracking')
  async onLatestTracking(vin: string): Promise<VehicleResult> {
    const exampleValue: RtInfo = {
      alarmWhistle: 0,
      audioSerial: '',
      locker1: 0,
      locker2: 0,
      warningLamp: 0,
      remoteCall: '0',
      videoSerial: '',
      pictureSerial: '',
      majorLight: 0,
      drivingState: 1,
    };
    await this.cacheService.store.set(`rt_example`, exampleValue);

    const {
      alarmWhistle,
      audioSerial,
      locker1,
      locker2,
      warningLamp,
      remoteCall,
      videoSerial,
      pictureSerial,
      majorLight,
      drivingState,
    } = (await this.cacheService.store.get(`rt_${vin}`)) as RtInfo; // <------ // NOTE MOCK THIS

    return {
      collectionTime: '',
      deviceStatusData: {
        alarmWhistle,
        locker1,
        locker2,
        majorLight,
        warningLamp,
        audioSerial,
        pictureSerial,
        remoteCall,
        videoSerial,
      },
      driveData: {
        drivingState,
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
      vehicleId: snowflakeId(),
      vin,
    };
  }
}
