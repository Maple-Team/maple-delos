import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '@/components/users/entities/user.entity'

@Entity({})
export class Team {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'name' })
  readonly name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({
    name: 'teams-users',
  })
  users: User[]
}
