import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Locale } from '../locale/entities/locale.entity'
import { Project } from '../projects/entities/project.entity'

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

    /**一个截图有多个词条，一个词条由多个截图 */
    @ManyToMany(() => Locale, (locale) => locale.screenshots)
    @JoinTable({
        name: 'screenshots-locales',
    })
    locales: Locale[]

    /**多个截图属于一个项目 */
    @ManyToOne(() => Project, (project) => project.screenshotses)
    @JoinTable({
        name: 'screenshots-projects',
    })
    project: Project
}
