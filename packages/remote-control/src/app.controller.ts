import type { ClientProxy } from '@nestjs/microservices'
import { MessagePattern } from '@nestjs/microservices'
import type { ControlExecuteCode, RemoteControlResult, SendCommandParams, VehicleResult } from '@liutsing/types-utils'
import { Inject } from '@nestjs/common'
import type { Cache } from 'cache-manager'
import { uuid } from '@liutsing/utils'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

type RtInfo = VehicleResult['deviceStatusData'] & VehicleResult['driveData']
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject('LOG_SERVICE') private logClient: ClientProxy,
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy
  ) {}

  @MessagePattern('sendCmd')
  async onSendCmd(params: SendCommandParams) {
    // mock to PUSH TO DEVICE
    this.logClient.emit('log', JSON.stringify(params))
    const { vin, instructionDtoList } = params
    const key = `rc_cmd_${vin}`
    const commandId = uuid(12)
    await this.cacheService.store.set(key, params)
    await this.cacheService.set(commandId, vin)
    const resultKey = `rc_result_${commandId}`
    const executeCode: ControlExecuteCode = '1' // <------ // NOTE 执行状态: MOCK THIS
    await this.cacheService.set(resultKey, executeCode)

    const commandType = instructionDtoList[0].commandType

    // 丢给mqtt去通过ws推送
    setTimeout(async () => {
      const resultCode = (await this.cacheService.get(resultKey)) as ControlExecuteCode

      const ret: RemoteControlResult = {
        vehicleId: uuid(12),
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
      }
      // const res = await this.mqttClient
      //   .send('topic-ecar-remote-control', JSON.stringify(ret))
      //   .toPromise();

      this.mqttClient.send('topic-ecar-remote-control', JSON.stringify(ret)).subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        },
      })
      // const res = await this.mqttClient
      //   .send('send-cmd', JSON.stringify(ret))
      //   .toPromise();
      // console.log(res);
    }, 5 * 1000)

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
      }
      const currentVehicleInfo: RtInfo = (await this.cacheService.store.get(`rt_${vin}`)) || defaultValue

      this.logClient.emit('log', JSON.stringify(currentVehicleInfo))

      let key = 'pictureSerial'
      switch (commandType) {
        case '01':
          key = 'majorLight'
          break
        case '02':
          key = 'warningLamp'
          break
        case '03':
          key = 'alarmWhistle'
          break
        case '04':
          key = 'drivingState'
          break
        case '05':
          key = 'drivingState'
          break
        case '0601':
          key = 'locker1'
          break
        case '0602':
          key = 'locker2'
          break
        default:
          break
      }
      if (key === 'drivingState') currentVehicleInfo[key] = executeCode === '1' ? 4 : 5
      else currentVehicleInfo[key] = executeCode === '1' ? 1 : 0

      this.logClient.emit('log', JSON.stringify(currentVehicleInfo))
      await this.cacheService.store.set(`rt_${vin}`, currentVehicleInfo)
    }, 6 * 1000)
    return commandId
  }

  @MessagePattern('getVehConResult')
  async onVehConResult(commandId: string): Promise<RemoteControlResult> {
    // 返回commandId执行的结果
    const vin = (await this.cacheService.get(commandId)) as string
    const key = `rc_cmd_${vin}`
    const params = (await this.cacheService.store.get(key)) as SendCommandParams
    const resultKey = `rc_result_${commandId}`
    const resultCode = (await this.cacheService.get(resultKey)) as ControlExecuteCode // <------ // NOTE 执行状态 MOCK THIS

    return {
      vehicleId: uuid(12),
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
    }
  }
}
