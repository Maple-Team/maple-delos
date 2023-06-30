import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlbumService } from './album.service'
import { AlbumController } from './album.controller'
import { Album } from './entities/album.entity'

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [TypeOrmModule.forFeature([Album])],
})
export class AlbumModule {}
