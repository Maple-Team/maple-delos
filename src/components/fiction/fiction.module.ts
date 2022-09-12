import { Module } from '@nestjs/common';
import { FictionService } from './fiction.service';
import { FictionController } from './fiction.controller';
import { Fiction } from './entities/fiction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Fiction])],
  controllers: [FictionController],
  providers: [FictionService],
})
export class FictionModule {}
