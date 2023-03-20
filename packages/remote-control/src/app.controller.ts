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

    const commandType = instructionDtoList[0].commandType;

    // 丢给mqtt去通过ws推送
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
            commandType,
            resultCode,
            resultMsg: '',
            errorDetailCode: '',
            errorDetailMsg: '',
          },
        ],
      };
      this.mqttClient.send('topic-ecar-remote-control', JSON.stringify(ret));
    }, 5 * 1000);

    setTimeout(async () => {
      // 更新redis rt 数据
      const defaultValue: RtInfo = {
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
      const ret: RtInfo =
        (await this.cacheService.store.get(`rt_${vin}`)) || defaultValue;
      this.logClient.emit('log', JSON.stringify(ret));
      let key = 'pictureSerial';
      switch (commandType) {
        case '01':
          key = 'majorLight';
          break;
        case '02':
          key = 'warningLamp';
          break;
        case '03':
          key = 'alarmWhistle';
          break;
        case '04':
          key = 'drivingState';
          break;
        case '05':
          key = 'drivingState';
          break;
        case '0601':
          key = 'locker1';
          break;
        case '0602':
          key = 'locker2';
          break;
        default:
          break;
      }
      if (key === 'drivingState') {
        ret[key] = executeCode === '1' ? 4 : 5;
      } else {
        ret[key] = executeCode === '1' ? 1 : 0;
      }
      this.logClient.emit('log', JSON.stringify(ret));
      await this.cacheService.store.set(`rt_${vin}`, ret);
    }, 6 * 1000);
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
}
