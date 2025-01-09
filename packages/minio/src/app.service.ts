import { Buffer } from 'buffer'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as Minio from 'minio'
import { uuid } from '@liutsing/utils'
import { LocaleData } from './type'

// FIXME 多个bucket的问题
const bucketName = process.env.MINIO_I18N_BUCKET || 'i18n-bucket'
@Injectable()
export class AppService {
  private readonly minioClient: Minio.Client
  constructor() {
    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    })
    minioClient.getBucketPolicy(bucketName, (e) => {
      e && console.log(e)
    })
    this.minioClient = minioClient
  }

  listObjectsV2(bucketName: string) {
    if (!bucketName) return
    // NOTE 需要有数据才行
    const objectsStream = this.minioClient.listObjectsV2(bucketName)
    objectsStream.on('data', (obj) => {
      console.log(obj)
    })
    objectsStream.on('error', (e) => {
      console.error(e)
    })
  }

  // @https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html#api-reference
  // https://github.com/minio/minio-js/blob/master/examples/put-object.js
  // loadPath: '/locales/version/{{lng}}/{{ns}}.json'
  updateLocale({ version, locale, data, ns = 'default', project }: LocaleData) {
    const file = `locales/${project}/${version}/${locale}/${ns}.json`
    this.minioClient.putObject(bucketName, file, JSON.stringify(data), (e) => {
      if (e) return console.log(e)
      console.log('Successfully uploaded the string')
    })
  }

  /**
   * 存储base64截图
   * @param data base64格式的截图
   * @returns
   */
  async uploadLocaleImage(data: string) {
    try {
      const [_1, dataStr] = data.split(',')
      const [str] = data.split(';')
      const [_2, mime] = str.split(':')
      const [_3, ext] = mime.split('/')
      const file = `screenShots/${uuid()}.${ext}`

      const imageData = Buffer.from(dataStr, 'base64')

      await this.minioClient.putObject(bucketName, file, imageData, { 'Content-Type': mime }).catch(console.error)

      return file
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  padStart(num: number) {
    return `${num}`.padStart(2, '0')
  }

  async uploadProxy(data: string | Buffer, contentType: string) {
    try {
      const [_, ext] = contentType.split('/')
      const date = new Date()
      const dir = `${date.getFullYear()}-${this.padStart(date.getMonth() + 1)}-${this.padStart(date.getDate())}`
      const file = `${dir}/${uuid()}.${ext}`

      await this.minioClient
        .putObject('proxy-bucket', file, data, { 'Content-Type': contentType })
        .then((...rest) => {
          console.log('保存成功', rest)
        })
        .catch(console.error)

      return file
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  getProxy(filePath: string) {
    try {
      return new Promise((resolve, reject) => {
        this.minioClient.getObject('proxy-bucket', filePath, (err, stream) => {
          if (err) {
            reject(err)
            return
          }

          const chunks = []
          stream.on('data', (chunk) => {
            chunks.push(chunk)
          })

          stream.on('end', () => {
            const buffer = Buffer.concat(chunks)
            resolve(buffer)
          })

          stream.on('error', (err) => {
            reject(err)
            console.error('Error reading stream:', err)
          })
        })
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
