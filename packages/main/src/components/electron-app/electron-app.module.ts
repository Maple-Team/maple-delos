import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ElectronAppService } from './electron-app.service'
import { ElectronAppController } from './electron-app.controller'
import { ElectronApp, ElectronAppSchema } from './schemas/electron-app.schemas'

@Module({
  imports: [MongooseModule.forFeature([{ name: ElectronApp.name, schema: ElectronAppSchema }])],
  controllers: [ElectronAppController],
  providers: [ElectronAppService],
})
export class ElectronAppModule {}
