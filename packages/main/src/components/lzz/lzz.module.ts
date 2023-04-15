import { Module } from '@nestjs/common'
import { LzzService } from './lzz.service'
import { LzzController } from './lzz.controller'
import { LzzSchema, Lzz } from './schemas/lzz.schemas'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  controllers: [LzzController],
  providers: [LzzService],
  imports: [MongooseModule.forFeature([{ name: Lzz.name, schema: LzzSchema }])],
})
export class LzzModule {}
