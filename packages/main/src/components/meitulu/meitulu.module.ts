import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MeituluService } from './meitulu.service'
import { MeituluController } from './meitulu.controller'
import { Meitulu, MeituluSchema } from './schemas/meitulu.schemas'

@Module({
  controllers: [MeituluController],
  providers: [MeituluService],
  imports: [MongooseModule.forFeature([{ name: Meitulu.name, schema: MeituluSchema }])],
})
export class MeituluModule {}
