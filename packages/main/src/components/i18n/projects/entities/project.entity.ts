import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Locale } from '../../locale/entities/locale.entity'
import { Screenshots } from '../../screenshot/entities'

@Entity({
    schema: 'projects',
})
export class Project {
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

    /** 一个项目有多个词条 */
    @ManyToMany(() => Locale, (locale) => locale.projects)
    @JoinTable({
        name: 'projects-locales',
    })
    locales: Locale[]

  /** 一个项目有多个截图 */
    @OneToMany(() => Screenshots, (screenshots) => screenshots.project)
    @JoinTable({
      name: 'screenshots-projects',
    })
    screenshotses: Screenshots[]
}
