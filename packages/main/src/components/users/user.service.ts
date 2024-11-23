import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { BaseList, BaseParams } from '@liutsing/types-utils'
import { OperationType, UserRole } from '@liutsing/enums'
import type { ChangePwdDto } from '@liutsing/types-utils'
import { OnEvent } from '@nestjs/event-emitter'
import { ModifyUser } from 'types'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { User } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'

const saltRounds = 10

@Injectable()
export class UserService {
  onlineDevices: string[] = []
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, saltRounds)
    const user = this.repo.create({ ...createUserDto, password: hash })
    const { password: _password, ...rest } = await this.repo.save(user)
    return { ...rest }
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    })
  }

  findAllModuleUsers() {
    return this.repo.find({
      where: {
        role: UserRole.DEVICE,
      },
    })
  }

  findOneByPhone(phone: string) {
    return this.repo.findOne({
      where: {
        phone,
      },
      select: {
        password: true,
        username: true,
        id: true,
        role: true,
      },
    })
  }

  findOneById(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
      select: {
        password: true,
        phone: true,
      },
    })
  }

  findUserInfo(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repo.update(id, updateUserDto)
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    if (user) return this.repo.softRemove(user)
  }

  async findMany({ pageSize, current, ...rest }: BaseParams<User>): Promise<BaseList<ModifyUser>> {
    const condition: FindOptionsWhere<User> = {
      role: Not(UserRole.ADMIN),
    }
    const keys = Object.keys(rest).filter((k) => !!rest[k])
    for (const k of keys) condition[k] = Like(`%${rest[k]}%`)

    // 模糊查找 非空处理
    const [total, records] = await Promise.all([
      this.repo.count({
        where: condition,
      }),
      this.repo.find({
        where: condition,
        skip: (current - 1) * pageSize,
        take: pageSize,
      }),
    ])
    const newRecords = records.map(({ feature, ...rest }) => ({
      ...rest,
      feature,
      isOnline: this.isOnline(feature),
    })) as ModifyUser[]
    return {
      pagination: {
        total,
        current,
        pageSize,
      },
      records: newRecords,
    }
  }

  async changePwd(data: ChangePwdDto, id: number) {
    const user = await this.findOneById(id)
    const isSamePasswd = await bcrypt.compare(data.oldPasswd, user.password)
    if (isSamePasswd) {
      const hash = await bcrypt.hash(data.newPasswd, saltRounds)
      return this.repo.update(id, { password: hash })
    } else {
      // TODO 抛出业务错误
      throw new BadRequestException('原始密码错误')
    }
  }

  async resetPwd(id: number) {
    const user = await this.findOneById(id)
    const hash = await bcrypt.hash(user.phone.substring(7), saltRounds)
    await this.repo.update(id, { password: hash })
  }

  async logs(id: number) {
    return await this.repo.findOne({
      where: {
        id,
      },
      relations: ['operations', 'operations.accessory'],
    })
  }

  /**
   * 按出入库accessory聚合查询
   * @param id
   */
  async accessoryGroupBy(id: number): Promise<{ count: string; accessoryId: string }[]> {
    return this.repo
      .createQueryBuilder('users')
      .leftJoin('users.operations', 'operations')
      .leftJoin('operations.accessory', 'accessory')
      .select('accessory.accessoryId', 'accessoryId')
      .addSelect('SUM(operations.accessoryNum)', 'count')
      .where({ id })
      .orderBy('count', 'DESC')
      .groupBy('accessory.accessoryId')
      .limit(10)
      .getRawMany()
  }

  /**
   * 按用户出库记录数统计
   */
  async userStats() {
    return this.repo
      .createQueryBuilder('users')
      .leftJoin('users.operations', 'operations')
      .addSelect('COUNT(operations.id)', 'count')
      .where('operations.operation_type = :operationType', { operationType: OperationType.STOCK_OUT })
      .groupBy('users.id')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany()
  }

  /**
   * 模块上线
   * @param param0
   */
  @OnEvent('module.connected')
  handleDeviceConnectEvent({ mac }: { mac: string }) {
    if (this.onlineDevices.includes(mac)) return
    if (!mac) return
    this.onlineDevices.push(mac)
    this.logger.info(`客户端${mac}上线`)
    this.logger.info({ onlineDevices: this.onlineDevices })
  }

  /**
   * 模块下线
   * @param param0
   */
  @OnEvent('module.disconnected')
  handleDeviceDisconnectEvent({ mac }: { mac: string }) {
    this.logger.info(`客户端${mac}离线`)
    this.onlineDevices.splice(this.onlineDevices.indexOf(mac) >>> 0, 1)
    this.logger.info({ onlineDevices: this.onlineDevices })
  }

  isOnline(feature: string) {
    return this.onlineDevices.includes(feature)
  }
}
