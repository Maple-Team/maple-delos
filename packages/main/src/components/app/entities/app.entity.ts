import { AppPlatform } from '@liutsing/enums'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

@Entity('mobile_apps')
@Unique('UNIQUE_PACKAGE_VERSION_BUILD', ['packageName', 'version', 'buildNum'])
export class App {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  appName: string

  @Column({ nullable: true })
  iconUrl?: string // 新增应用图标链接

  @Column({ type: 'varchar', length: 20 })
  version: string

  @Column({ type: 'int', name: 'build_num' })
  buildNum: number // 改为普通整数类型

  @Column({
    type: 'enum',
    enum: AppPlatform,
    default: AppPlatform.ANDROID,
  })
  platform: AppPlatform

  @Column({ name: 'package_name', length: 100 })
  packageName: string

  @Column({ name: 'package_size', type: 'int' })
  packageSize: number

  @Column({ nullable: true })
  downloadUrl?: string

  @Column({ type: 'text', nullable: true })
  updateLog?: string

  @Column({ default: false })
  forceUpdate: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
