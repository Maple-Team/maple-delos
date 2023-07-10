import os from 'node:os'
import path from 'node:path'
import { readdirSync, statSync, writeFile } from 'node:fs'
import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { mkdirSafeSync } from '@liutsing/node-utils'
import { AnyFilesInterceptor } from '@nestjs/platform-express'

// https://javascript.plainenglish.io/implement-concurrent-upload-of-large-files-in-javascript-53519a0d2eee

@Controller('chunk-upload')
@UseInterceptors(TransformInterceptor)
export class ChunkUploadController {
  @Post('single')
  @UseInterceptors(
    // FilesInterceptor('chunk-file', 1, {
    //   storage: multer.diskStorage({
    //     destination: (req, file, callback) => {
    //       // Access other non-binary data from req.body
    //       // @ts-expect-error: xx
    //       console.log(req.body, req.a, '================')
    //       const directory = ''
    //       const fileDest = path.resolve(os.tmpdir(), `./uploads/${directory}`)
    //       mkdirSafeSync(fileDest, { recursive: true })
    //       console.log(fileDest)
    //       callback(null, fileDest)
    //     },
    //   }),
    // })
    AnyFilesInterceptor()
  )
  upload(@Body() body, @UploadedFiles() files: Array<Express.Multer.File>) {
    const { fileName, fileMd5 } = body
    const file = files[0]
    const fileDest = path.resolve(os.tmpdir(), `./uploads/${fileMd5}`)
    // const fileDest = path.resolve('/tmp', 'uploads', directory);

    mkdirSafeSync(fileDest, { recursive: true })

    writeFile(`${fileDest}/${file.originalname}`, file.buffer, (e) => {
      if (e) throw e
      else console.log('write')
    })
    return fileDest
  }

  @Get('exists')
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
      const fileDest = path.resolve(os.tmpdir(), `./uploads/${fileMd5}`)
      if (statSync(fileDest).isDirectory()) {
        return {
          isExists: false,
          chunkIds: readdirSync(fileDest),
        }
      }
    }
  }

  @Get('concat-files')
  async concatFiles(@Query() query) {
    const { name: fileName, md5: fileMd5 } = query
    // await concatFiles(path.join(TMP_DIR, fileMd5), path.join(UPLOAD_DIR, fileName))
  }

  /**
   * 合并chunks
   */
  async _concatFiles(sourceDir: string, targetPath: string) {
    console.log(sourceDir, targetPath)
  }
}
