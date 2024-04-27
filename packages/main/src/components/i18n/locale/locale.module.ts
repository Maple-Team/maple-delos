import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocaleService } from './locale.service'
import { LocaleController } from './locale.controller'
import { Locale } from './entities/locale.entity'

@Module({
  controllers: [LocaleController],
  providers: [LocaleService],
  imports: [TypeOrmModule.forFeature([Locale])],
})
export class LocaleModule {}
