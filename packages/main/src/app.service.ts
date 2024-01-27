import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserRole } from '@liutsing/enums'
import { User } from './components/users/entities/user.entity'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {}

  hello(): string {
    return 'Hello World!'
  }

  /**
   * 根据你的需求检查数据是否存在
   */
  async checkDataExists(): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        phone: '18123845936', // TODO 更新手机号
      },
    })
    return count > 0
  }

  /**
   * 插入初始管理员数据
   */
  async insertData(): Promise<void> {
    const newData = this.repo.create({
      password: '$2b$10$OUYx0DoMZqAW3faOE/EDW.yc0Enx/Cj2WVyNDB7ZKtArWb4ueSD2O', // 5936
      phone: '18123845936',
      username: 'Admin',
      role: UserRole.ADMIN,
      feature: 'admin',
      staffId: 'A0001',
    })
    await this.repo.save(newData)
  }
}
