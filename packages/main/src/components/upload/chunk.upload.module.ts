import { Module } from '@nestjs/common'
import { ChunkUploadController } from './chunk.upload.controller'

@Module({
  controllers: [ChunkUploadController],
  providers: [],
})
export class ChunkUploadModule {}
