import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { UserRole } from '@liutsing/enums'
import { Team } from '@/components/i18n/teams/entities/team.entity'

@Entity()
export class User extends BaseEntity {
  constructor() {
    super()
    this.role = UserRole.USER
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'staff_id', comment: '员工id', nullable: true })
  readonly staffId: string

  @Column({ name: 'user_name', unique: true })
  readonly username: string

  @Column({ name: 'user_phone', unique: true })
  readonly phone: string

  @Column({ name: 'feature', unique: true, comment: '设备地址', nullable: true })
  readonly feature: string

  @Exclude()
  @Column({ name: 'password', select: false })
  readonly password: string

  @Column({ name: 'avatar', default: '' })
  readonly avatar: string

  @Column({ name: 'refresh_token', default: null })
  readonly refreshToken: string

  @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.DEVICE })
  readonly role: UserRole

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date

  @DeleteDateColumn({
    nullable: true,
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt: Date

  @ManyToMany(() => Team, (team) => team.users)
  @JoinColumn({
    name: 'team_id',
    // referencedColumnName: 'albumName', FIXME
  })
  teams: Team[]
}
