import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SonYoonJooDocument, SonYoonJoo } from './schemas/sonyoonjoo.schema'

@Injectable()
export class SonyoonjooService {
  constructor(@InjectModel(SonYoonJoo.name) private model: Model<SonYoonJooDocument>) {}

  async findAll(): Promise<SonYoonJoo[]> {
    return this.model.find({}).skip(0).limit(10).exec()
  }
}
