import { Label } from 'src/components/label/entities/label.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fiction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  readonly name: string;
  @Column()
  readonly chapter: number;
  @Column()
  readonly content: string;
  @Column()
  readonly readCount: number;
  @Column()
  readonly words: number;
  @OneToMany(() => Label, (label) => label.id)
  labels: Label[];
}
