import { resolve } from 'node:path'
import { RequestMethod, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule } from '@nestjs/swagger'
import bodyParser from 'body-parser'
import { AppModule } from './app.module'
import { swaggerConfig, swaggerOptions } from './swagger'
import { validationPipe } from './validator'

const root = resolve(__dirname, '..')
const version = require(`${root}/package.json`).version

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
  // NOTE 激活class-validator验证
  app.useGlobalPipes(validationPipe)
  app.setGlobalPrefix('api', {
    exclude: [
      // 排除不需要前缀的路由
      // NOTE 会影响中间件的执行次数
      //   { path: '/', method: RequestMethod.GET },
      { path: '/health', method: RequestMethod.GET },
    ],
  })
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-VERSION',
  })

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  // swagger api 列表: http://localhost:4003/api/docs
  SwaggerModule.setup('docs', app, document, swaggerOptions)

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
  console.log(
    `Application is running on: ${await app.getUrl()}, version: ${version}-${process.env.APP_VERSION || 'dev'}`
  )
}

bootstrap().catch(console.error)
const getTimeStr = () => {
  const date = new Date()
  const timeStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${date.getMilliseconds()}`
  return timeStr
}

// process.on('unhandledRejection', (reason, promise) => {
//   console.error(getTimeStr(), 'unhandledRejection', {
//     type: 'UNHANDLED_REJECTION',
//     promise,
//     reason,
//   })
// })

// 捕获未处理的异常
process.on('uncaughtException', (err, origin) => {
  console.error(getTimeStr(), 'Uncaught Exception:', err, origin)
})
