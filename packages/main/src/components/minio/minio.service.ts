import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { LocaleData } from '@/type'

@Injectable()
export class MinioService {
    constructor(@Inject('MINIO_SERVICE') private minioClient: ClientProxy) { }

    listObjects() {
        const res = this.minioClient.emit('list-objects', {
            bucketName: 'i18n-bucket',
        })
        res.subscribe(() => {
            console.log('send')
        })
        return 'ok'
    }

    updateLocale(data: LocaleData) {
        const res = this.minioClient.emit('update-locale', data)
        res.subscribe(() => {
            console.log('send')
        })
        return 'ok'
    }

    uploadLocaleImage(data: string) {
        return this.minioClient.send('upload-locale-image', data)
    }
}
