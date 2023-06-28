import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SonYoonJooDocument, SonYoonJoo } from './schemas/sonyoonjoo.schema'
import { BaseList } from '@liutsing/types-utils'

@Injectable()
export class SonyoonjooService {
  constructor(@InjectModel(SonYoonJoo.name) private model: Model<SonYoonJooDocument>) {}

  async findWithPagination(
    page: number,
    pageSize: number,
    rest: {
      year?: number
      path?: string
    }
  ): Promise<BaseList<SonYoonJoo>> {
    const filterKeys: {
      year?: number
      path?: {
        $regex: RegExp
      }
    } = {}
    if (rest.year) {
      filterKeys.year = rest.year
    }
    if (rest.path) {
      filterKeys.path = {
        $regex: new RegExp(rest.path),
      }
    }
    const total = await this.model.find({ ...filterKeys }).count()

    const data = await this.model
      .find({ ...filterKeys })
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

  async fetchYears() {
    return await this.model.find({}).select('year _id').distinct('year')
  }

  async findById(id: string) {
    return await this.model.findById(id)
  }

  async findPrevAndNext(id: string) {
    const model = await this.model.findById(id)
    const date = model?.date
    const prev = await this.model.findOne({ date: { $lt: date } }).sort({ date: 'desc' })
    const next = await this.model.findOne({ date: { $gt: date } }).sort({ date: 'asc' })
    return { prev, next }
  }
}
