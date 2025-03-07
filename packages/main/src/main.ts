import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import { AppModule } from './app.module'

/**
  // httpsOptions = {
  //   key: fs.readFileSync(`${homeDir}/localhost-key.pem`),
  //   cert: fs.readFileSync(`${homeDir}/localhost.pem`),
  // }
  //   }
  // NOTE socket.io server not working
  //   const httpServer = express()
  //   httpServer.use(cors()) // 添加cors中间件
  //   httpServer.use(bodyParser.json({ limit: '50mb' }))
  //   httpServer.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  //   const httpApp = await NestFactory.create(AppModule, new ExpressAdapter(httpServer), { cors: true })
  //   httpApp.enableCors({ origin: '*' })

  //   httpApp.setGlobalPrefix('api', { exclude: ['/', '/health'] })

  //   const config = new DocumentBuilder()
  //     .setTitle('MapleImage')
  //     .setDescription('The maple admin API description')
  //     .setVersion(require('../package.json').version)
  //     .build()
  //   const document = SwaggerModule.createDocument(httpApp, config)
  //   SwaggerModule.setup('api', httpApp, document)

  //   await httpApp.init()
  //   const newPort = +port! + 1

  //   httpServer.listen(newPort, '0.0.0.0', () => {
  //     console.log(`http server is running: http://127.0.0.1:${newPort}`)
  //   })

 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('MapleImage')
    .setDescription('The maple admin API description')
    .setVersion(require('../package.json').version)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // API配置
  app.setGlobalPrefix('api', { exclude: ['/', '/health'] })
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-VERSION',
  })

  // 全局中间件配置
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')

  await app.listen(port, '0.0.0.0')
  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap().catch(console.error)
