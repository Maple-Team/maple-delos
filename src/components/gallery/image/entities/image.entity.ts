import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Album } from '../../album/entities/album.entity'

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'image_name',
  })
  readonly imageName: string

  @Column({
    name: 'image_width',
  })
  readonly width: number

  @Column({
    name: 'image_height',
  })
  readonly height: number

  @Column({
    name: 'image_description',
  })
  readonly description?: string

  @Column({
    name: 'image_likes',
    default: 0,
  })
  readonly imageLikes?: number

  @Column({
    name: 'image_views',
    default: 0,
    nullable: true,
  })
  readonly imageViews: number

  @ManyToOne(() => Album, (album) => album.images)
  @JoinColumn({
    name: 'album_id',
    // referencedColumnName: 'albumName', FIXME
  })
  album: Album

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number

  @UpdateDateColumn({
    nullable: true,
    name: 'updated_at',
  })
  updatedAt: number
}
