import os from 'node:os'
import path from 'node:path'
import { statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { mkdirSafeSync } from '@liutsing/node-utils'
import { diskStorage } from 'multer'

// https://javascript.plainenglish.io/implement-concurrent-upload-of-large-files-in-javascript-53519a0d2eee

@Controller('chunk-upload')
@UseInterceptors(TransformInterceptor)
export class ChunkUploadController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('chunk-file', 10, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          //   const directory = createHash('md5').update(file.buffer).digest('hex')
          const directory = ''
          const fileDest = path.resolve(os.tmpdir(), `./uploads/${directory}`)
          console.log(file)
          mkdirSafeSync(fileDest, { recursive: true })
          callback(null, fileDest)
        },
      }),
    })
  )
  upload(@Body() body, @UploadedFiles() files: Array<Express.Multer.File>) {
    // console.log(files[0])
    return files[0].path
  }

  @Get()
  fileExist(@Query() query) {
    const { name: fileName, md5: fileMd5 } = query as { name: string; md5: string }
    const imageDir = path.resolve(process.cwd(), './uploads/images')
    mkdirSafeSync(imageDir, { recursive: true })
    const filePath = path.resolve(imageDir, fileName)
    const stats = statSync(filePath)
    if (stats.isFile()) {
      return {
        isExists: true,
      }
    } else {
      const chunksIds = []
    }
  }
}
