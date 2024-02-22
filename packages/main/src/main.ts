import * as fs from 'node:fs'
import * as os from 'node:os'
import { NestApplicationOptions, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ExpressAdapter } from '@nestjs/platform-express'
import express from 'express'
import cors from 'cors' // 导入cors模块
import { AppModule } from './app.module'

const isDev = process.env.NODE_ENV === 'development'

async function bootstrap() {
  const homeDir = os.homedir()
  let httpsOptions: NestApplicationOptions['httpsOptions'] | undefined
  if (isDev) {
    httpsOptions = {
      key: fs.readFileSync(`${homeDir}/localhost-key.pem`),
      cert: fs.readFileSync(`${homeDir}/localhost.pem`),
    }
  }
  const httpsApp = await NestFactory.create(AppModule, { cors: true, httpsOptions })

  // SwaggerModule
  //   const config = new DocumentBuilder()
  //     .setTitle('MapleImage')
  //     .setDescription('The maple admin API description')
  //     .setVersion('1.0')
  //     .build()

  //   const document = SwaggerModule.createDocument(app, config)
  //   SwaggerModule.setup('api', app, document)
  httpsApp.setGlobalPrefix('api', { exclude: ['/', '/health'] })
  httpsApp.enableVersioning({
    // type: VersioningType.URI,
    type: VersioningType.HEADER,
    header: 'X-API-VERSION', // 不同的版本类型 https://docs.nestjs.com/techniques/versioning
  })
  const configService = httpsApp.get(ConfigService)
  const port = configService.get<number>('PORT')

  await httpsApp.listen(port, '0.0.0.0')
  console.log(`Application is running on: ${await httpsApp.getUrl()}`)

  // NOTE socket.io server not working
  const httpServer = express()
  httpServer.use(cors()) // 添加cors中间件
  const httpApp = await NestFactory.create(AppModule, new ExpressAdapter(httpServer), { cors: true })
  httpApp.enableCors({ origin: '*' })
  httpApp.setGlobalPrefix('api', { exclude: ['/', '/health'] })

  await httpApp.init()
  const newPort = +port! + 1

  httpServer.listen(newPort, '0.0.0.0', () => {
    console.log(`http server is running: http://127.0.0.1:${newPort}`)
  })
}
bootstrap().catch(console.error)
