import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SonyoonjooService } from './sonyoonjoo.service'
import { SonyoonjooController } from './sonyoonjoo.controller'
import { SonYoonJoo, SonYoonJooSchema } from './schemas/sonyoonjoo.schema'

@Module({
  controllers: [SonyoonjooController],
  providers: [SonyoonjooService],
  imports: [MongooseModule.forFeature([{ name: SonYoonJoo.name, schema: SonYoonJooSchema }])],
})
export class SonyoonjooModule {}
