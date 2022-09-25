import { Label } from 'src/components/label/entities/label.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Fiction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'chapter_name' })
  readonly chapterName: string;
  @Column({ name: 'book_name' })
  readonly bookName: string;
  @Column({ name: 'chapter_no' })
  readonly chapterNo: number;
  @Column({ name: 'chapter_content', type: 'text' })
  readonly chapterContent: string;
  @Column({
    comment: '阅读量',
    name: 'read_count',
    nullable: true,
  })
  readonly readCount: number;
  @Column()
  readonly words: number;
  @ManyToMany(() => Label)
  @JoinTable({
    name: 'fictions_labels',
  })
  labels: Label[];
  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number;
}
