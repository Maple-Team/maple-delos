import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MinioModule } from '../minio/minio.module'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { App } from './entities/app.entity'

@Module({
  imports: [MinioModule, TypeOrmModule.forFeature([App])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppPackageModule {}
