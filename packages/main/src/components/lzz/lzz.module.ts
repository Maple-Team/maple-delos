import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LzzService } from './lzz.service'
import { LzzController } from './lzz.controller'
import { Lzz, LzzSchema } from './schemas/lzz.schemas'

@Module({
  imports: [MongooseModule.forFeature([{ name: Lzz.name, schema: LzzSchema }])],
  providers: [LzzService],
  controllers: [LzzController],
})
export class LzzModule {}
