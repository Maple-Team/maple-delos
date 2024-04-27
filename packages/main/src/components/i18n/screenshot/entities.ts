import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Locale } from '../locale/entities/locale.entity'

@Entity({
  schema: 'screenshots',
})
export class Screenshots {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'src' })
  readonly src: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number

  @ManyToMany(() => Locale, (locale) => locale.screenshots)
  @JoinTable({
    name: 'screenshots_locales',
  })
  locales: Locale[]
}
