import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({})
export class Label {
  @PrimaryGeneratedColumn()
  readonly id: string;
  @Column({ unique: true })
  readonly name: string;
  @Column({ unique: true })
  readonly type: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number;
}
