import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LzzService } from './lzz.service'
import { LzzController } from './lzz.controller'
import { Lzz, LzzSchema } from './schemas/lzz.schemas'

@Module({
  controllers: [LzzController],
  providers: [LzzService],
  imports: [MongooseModule.forFeature([{ name: Lzz.name, schema: LzzSchema }])],
})
export class LzzModule {}
