import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Image } from '../../image/entities/image.entity'
import { Label } from '@/components/label/entities/label.entity'

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'album_name',
  })
  readonly albumName: string

  @Column({
    name: 'author_name',
    nullable: true,
  })
  readonly authorName: string

  @Column({
    name: 'author_id',
    nullable: true,
  })
  readonly authorId: string

  @Column({
    name: 'album_image_count',
    default: 0,
  })
  readonly albumImageCount: string

  @Column({
    name: 'album_image_description',
    nullable: true,
  })
  readonly albumImageDescription: string

  @Column({
    name: 'album_likes',
    default: 0,
    nullable: true,
  })
  readonly albumLikes: number

  @Column({
    name: 'album_views',
    default: 0,
    nullable: true,
  })
  readonly albumViews: number

  @Column({
    name: 'album_no',
    nullable: true,
  })
  readonly albumNO: string

  @ManyToMany(() => Label)
  @JoinTable({
    name: 'albums-labels',
  })
  labels: Label[]

  @OneToMany(() => Image, (image) => image.album)
  images: Image[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number
}
