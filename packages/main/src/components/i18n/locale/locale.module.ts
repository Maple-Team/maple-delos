import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsModule } from '../projects/projects.module'
import { ScreenshotModule } from '../screenshot/screenshot.module'
import { LocaleService } from './locale.service'
import { LocaleController } from './locale.controller'
import { Locale } from './entities/locale.entity'

@Module({
  controllers: [LocaleController],
  providers: [LocaleService],
  imports: [TypeOrmModule.forFeature([Locale]), ProjectsModule, ScreenshotModule],
})
export class LocaleModule {}
