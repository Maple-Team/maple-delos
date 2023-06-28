import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Meitulu, MeituluDocument } from './schemas/meitulu.schemas'
import { BaseList } from '@liutsing/types-utils'

export interface MeituluFilterKey {
  modelName?: AnyToFix
  tags?: AnyToFix
  title?: AnyToFix
  orgName?: AnyToFix
}
@Injectable()
export class MeituluService {
  constructor(@InjectModel(Meitulu.name) private model: Model<MeituluDocument>) {}

  async findWithPagination(page: number, pageSize: number, rest: MeituluFilterKey): Promise<BaseList<Meitulu>> {
    const filterKeys: MeituluFilterKey = {}

    if (rest.modelName) {
      filterKeys.modelName = {
        $regex: new RegExp(rest.modelName),
      }
    }
    if (rest.tags) {
      filterKeys.tags = {
        $regex: new RegExp(rest.tags),
      }
    }
    if (rest.title) {
      filterKeys.title = {
        $regex: new RegExp(rest.title),
      }
    }
    if (rest.orgName) {
      filterKeys.orgName = {
        $regex: new RegExp(rest.orgName),
      }
    }
    const total = await this.model.find({ ...filterKeys }).count()

    const data = await this.model
      .find({ ...filterKeys })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
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

  async findById(id: string) {
    return await this.model.findById(id)
  }

  // TODO https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
  async findTags() {
    return await this.model
      .find({})
      // .select('tags _id')
      .distinct('tags')
  }

  async findModelNames() {
    return await this.model.find({}).select('modelName _id').distinct('modelName')
  }

  async findOrgNames() {
    return await this.model.find({}).select('orgName _id').distinct('orgName')
  }
}
