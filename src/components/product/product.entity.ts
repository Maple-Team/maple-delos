import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  price: number

  @Column()
  discountPercentage: number

  @Column()
  rating: number

  @Column()
  stock: number

  @Column()
  brand: string

  @Column()
  category: string

  @Column()
  thumbnail: string

  @Column({ length: 1000 })
  images: string // TODO 读取时添加处理
  // TODO mysql事件
}
