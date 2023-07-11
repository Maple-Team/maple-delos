import os from 'node:os'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from 'node:fs'
import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { mkdirSafeSync } from '@liutsing/node-utils'
import { FilesInterceptor } from '@nestjs/platform-express'
import multer from 'multer'

const APP_NAME = 'maple-upload'

// https://javascript.plainenglish.io/implement-concurrent-upload-of-large-files-in-javascript-53519a0d2eee
/**
 * 1.文件是否存在接口: 返回存在或已经上传的chunksId
 * 2.文件分片，并行上传  -> 转入到worker中执行这些耗时操作
 * 3.上传成功
 * 4.合并文件chunk
 */

@Controller('chunk-upload')
@UseInterceptors(TransformInterceptor)
export class ChunkUploadController {
  @Post('single')
  @UseInterceptors(
    FilesInterceptor('chunk-file', 1, {
      storage: multer.diskStorage({
        destination: (_, file, callback) => {
          const [fileMD5] = file.originalname.split('-')
          const fileDest = path.resolve(os.tmpdir(), `./${APP_NAME}/${fileMD5}`)
          mkdirSafeSync(fileDest, { recursive: true })
          callback(null, fileDest)
        },
        filename: (_req, file, cb) => {
          const [_, chunkIndex] = file.originalname.split('-')
          cb(null, `${chunkIndex}`)
        },
      }),
    })
    // AnyFilesInterceptor()
  )
  upload(@Body() body, @UploadedFiles() files: Array<Express.Multer.File>) {
    // const file = files[0]
    // const fileDest = path.resolve(os.tmpdir(), `./uploads/${fileMd5}`)
    // // const fileDest = path.resolve('/tmp', 'uploads', directory);

    // mkdirSafeSync(fileDest, { recursive: true })

    // writeFile(`${fileDest}/${file.originalname}`, file.buffer, (e) => {
    //   if (e) throw e
    //   else console.log('write')
    // })
    // return fileDest
    return { ...body, path: files[0].path }
  }

  @Get('exists')
  fileExist(@Query() query) {
    const { name: fileName, md5: fileMd5 } = query as { name: string; md5: string }
    const imageDir = path.resolve(process.cwd(), './uploads/images')
    mkdirSafeSync(imageDir, { recursive: true })
    const filePath = path.resolve(imageDir, fileName)
    const isExist = existsSync(filePath)
    if (isExist) {
      return {
        isExists: true,
        chunkIds: [],
      }
    } else {
      const fileDest = path.resolve(os.tmpdir(), `./${APP_NAME}/${fileMd5}`)
      if (statSync(fileDest).isDirectory()) {
        return {
          isExists: false,
          chunkIds: readdirSync(fileDest),
        }
      }
    }
  }

  /**
   * 合并chunks
   * @param sourceDir 分片集地址
   * @param targetFilePath 待合并的目标文件地址
   */
  async _concatFiles(sourceDir: string, targetFilePath: string) {
    const slices = readdirSync(sourceDir)
      .filter((f) => !f.startsWith('._'))
      .sort()

    const file = slices.reduce(
      (prev: Buffer, curr) => Buffer.concat([prev, readFileSync(`${sourceDir}/${curr}`)]),
      Buffer.from([])
    )

    writeFileSync(targetFilePath, file)
  }

  @Get('concat-files')
  async concatFiles(@Query() query) {
    const { name: fileName, md5: fileMD5 } = query
    const fileDest = path.resolve(os.tmpdir(), `./${APP_NAME}/${fileMD5}`)
    await this._concatFiles(fileDest, path.resolve(process.cwd(), `./uploads/images/${fileName}`))
  }
}
