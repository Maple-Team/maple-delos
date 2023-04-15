import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Lzz, LzzDocument } from './schemas/lzz.schemas'

@Injectable()
export class LzzService {
  async findById(id: string) {
    return await this.model.findById(id)
  }

  constructor(@InjectModel(Lzz.name) private model: Model<LzzDocument>) {}

  async findAll() {
    return await this.model.find({})
  }

  async findWithPagination(page: number, pageSize: number): Promise<BaseList<Lzz>> {
    const total = await this.model.find({}).count()

    const data = await this.model
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ date: -1 })
      .exec()

    return {
      pagination: {
        total,
        current: +page,
        pageSize,
      },
      records: data,
    }
  }
}
