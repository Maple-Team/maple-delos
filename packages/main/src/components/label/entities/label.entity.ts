import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({})
export class Label {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ unique: true })
  name: string

  @Column()
  type: LabelType

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number
}
