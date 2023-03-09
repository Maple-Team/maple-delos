import { Module } from '@nestjs/common'
import { FictionService } from './fiction.service'
import { FictionController } from './fiction.controller'
import { Fiction } from './entities/fiction.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Label } from '../label/entities/label.entity'
import { LabelService } from '../label/label.service'

@Module({
  imports: [TypeOrmModule.forFeature([Fiction]), TypeOrmModule.forFeature([Label])],
  controllers: [FictionController],
  providers: [FictionService, LabelService],
})
export class FictionModule {}
