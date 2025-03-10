import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Screenshots } from '../../screenshot/entities'
import { Project } from '../../projects/entities/project.entity'

@Entity({ schema: 'i18n-locale' })
export class Locale {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'key' })
  readonly key: string

  @Column({ name: 'zh_CN' })
  readonly zhCN: string

  @Column({ name: 'zh_HK' })
  readonly zhHK: string

  @Column({ name: 'en_US' })
  readonly enUS: string

  @Column({ name: 'project' })
  readonly project: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number

  @ManyToMany(() => Screenshots, (screenshots) => screenshots.locales)
  @JoinTable({
    name: 'screenshots-locales',
  })
  screenshots: Screenshots[]

  @ManyToMany(() => Project, (project) => project.locales)
  @JoinTable({
    name: 'projects-locales',
  })
  projects: Project[]
}
