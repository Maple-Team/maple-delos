import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

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
}
