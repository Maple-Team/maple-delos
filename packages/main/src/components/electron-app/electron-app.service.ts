import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateElectronAppDto } from './dto/create-electron-app.dto'
import { UpdateElectronAppDto } from './dto/update-electron-app.dto'
import { ElectronApp, ElectronAppDocument } from './schemas/electron-app.schemas'

@Injectable()
export class ElectronAppService {
  constructor(@InjectModel(ElectronApp.name) private model: Model<ElectronAppDocument>) {}

  create(createElectronAppDto: CreateElectronAppDto) {
    return this.model.create(createElectronAppDto)
  }

  findAll() {
    return 'This action returns all electronApp'
  }

  findOne(id: number) {
    return `This action returns a #${id} electronApp`
  }

  update(id: number, _updateElectronAppDto: UpdateElectronAppDto) {
    return `This action updates a #${id} electronApp`
  }

  remove(id: number) {
    return `This action removes a #${id} electronApp`
  }

  findLatest({ name, versionCode }: { name: string; versionCode?: number }) {
    if (versionCode) {
      return this.model
        .findOne({
          name,
          versionCode: { $gt: versionCode },
        })
        .sort({ versionCode: -1 })
    }
    return this.model
      .findOne({
        name,
      })
      .sort({ versionCode: -1 })
  }
}
