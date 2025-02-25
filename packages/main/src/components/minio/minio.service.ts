import { Buffer } from 'buffer'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class MinioService {
  constructor(@Inject('MINIO_SERVICE') private minioClient: ClientProxy) {}

  listObjects() {
    const res = this.minioClient.emit('list-objects', {
      bucketName: 'i18n-bucket',
    })
    res.subscribe(() => {
      console.log('send')
    })
    return 'ok'
  }

  updateLocale(localeData: LocaleData) {
    return this.minioClient.emit('update-locale', localeData)
    // return res.pipe(switchMap((s) => s))
  }

  uploadLocaleImage(data: string) {
    return this.minioClient.send('upload-locale-image', data)
  }

  updateApp(data: { fileName: string; packageName: string; buffer: Buffer; mimetype: string }) {
    return new Promise<string>((resolve, reject) => {
      this.minioClient.send('upload-app', data).subscribe({
        next: (filePath: string) => {
          resolve(filePath)
        },
        error: (error: Error) => {
          reject(error)
        },
        complete: () => {},
      })
    })
  }

  uploadAppIconImage(data: string, packageName: string) {
    return new Promise<string>((resolve, reject) => {
      this.minioClient.send('upload-app-icon-image', { data, packageName }).subscribe({
        next: (filePath: string) => {
          resolve(filePath)
        },
        error: (error: Error) => {
          reject(error)
        },
        complete: () => {},
      })
    })
  }
}
