import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { BaseList } from '@liutsing/types-utils'
import type { Model } from 'mongoose'
import type { BlogDocument } from './schemas/blog.schema'
import { Blog } from './schemas/blog.schema'
import type { CreateBlogDto } from './dto/create-blogDto'

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private Model: Model<BlogDocument>) {}

  async create(createDto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.Model(createDto)
    return createdBlog.save()
  }

  async findAll(): Promise<Blog[]> {
    return this.Model.find().exec()
  }

  async remove(id: string) {
    return this.Model.findByIdAndRemove(id)
  }

  async insertMany(data: Blog[]) {
    return this.Model.insertMany(data)
  }

  async findById(id: string) {
    return this.Model.findById(id)
  }

  async findPrevAndNext(id: string) {
    const model = await this.Model.findById(id)
    const date = model?.date
    const prev = await this.Model.findOne({ date: { $lt: date } }).sort({ date: 'desc' })
    const next = await this.Model.findOne({ date: { $gt: date } }).sort({ date: 'asc' })
    return { prev, next }
  }

  async findWithLimit({
    current,
    size,
    ...rest
  }: {
    current: number
    size: number
    rest: Partial<Blog>
  }): Promise<BaseList<Blog>> {
    const query = {}
    const keys = Object.keys(rest).filter((k) => !!rest[k])
    for (const k of keys) query[k] = rest[k]

    // 模糊查找 非空处理
    const [total, records] = await Promise.all([
      this.Model.find(query).count(),
      this.Model.find(query, null, { skip: (current - 1) * size, limit: size }),
    ])
    return {
      pagination: {
        total,
        current,
        pageSize: size,
      },
      records,
    }
  }

  async fetchCategory() {
    return await this.Model.find({}).select('category _id').distinct('category')
  }
}
