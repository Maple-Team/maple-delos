import { Injectable } from '@nestjs/common'
import * as Minio from 'minio'
import { LocaleData } from './type'

@Injectable()
export class AppService {
  private readonly minioClient: Minio.Client
  constructor() {
    const minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: 'QpV65O7Dnc2jDBCDOnz5',
      secretKey: 'VfdkjoVTYWPEL7M98D8ulTx9qeJZm1ZNTFd53fWN',
    })

    this.minioClient = minioClient
  }

  listObjectsV2() {
    const objectsStream = this.minioClient.listObjectsV2('test-bucket', '', true, '')
    objectsStream.on('data', (obj) => {
      console.log(obj)
    })
    objectsStream.on('error', (e) => {
      console.log(e)
    })
  }

  // @https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html#api-reference
  // https://github.com/minio/minio-js/blob/master/examples/put-object.js
  // loadPath: '/locales/version/{{lng}}/{{ns}}.json'
  updateLocale({ version, locale, data, ns = 'default' }: LocaleData) {
    const file = `locales/${version}/${locale}/${ns}.json`
    this.minioClient.putObject('i18n-bucket', file, JSON.stringify(data), (e) => {
      if (e) return console.log(e)
      console.log('Successfully uploaded the string')
    })
  }
}
