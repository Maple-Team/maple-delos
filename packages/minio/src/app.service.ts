import { Buffer } from 'buffer'
import { Injectable } from '@nestjs/common'
import * as Minio from 'minio'
import { uuid } from '@liutsing/utils'
import { LocaleData } from './type'

@Injectable()
export class AppService {
    private readonly minioClient: Minio.Client
    constructor() {
        const minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: 9000,
            useSSL: false,
            // mac
            // accessKey: 'QpV65O7Dnc2jDBCDOnz5',
            // secretKey: 'VfdkjoVTYWPEL7M98D8ulTx9qeJZm1ZNTFd53fWN',
            // walle
            accessKey: 'WVSZfWXkKYT1LRGPU2iZ',
            secretKey: 'XToJxC6tfEF5YJIXmszC2OMyaGdrDV3WedXQN8Rb',
        })
        minioClient.getBucketPolicy('i18n-bucket', (e, r) => {
            console.log(e, r)
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
        this.minioClient.putObject('i18n-bucket', file, JSON.stringify(data), (e) => {
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
        const [_1, dataStr] = data.split(',')
        const [str] = data.split(';')
        const [_2, mime] = str.split(':')
        const [_3, ext] = mime.split('/')
        const file = `screenShots/${uuid()}.${ext}`

        const imageData = Buffer.from(dataStr, 'base64')

        await this.minioClient
            .putObject('i18n-bucket', file, imageData, { 'Content-Type': mime })
            .catch(console.error)

        return file
    }
}
