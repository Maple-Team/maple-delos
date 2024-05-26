import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import cors from 'cors' // 导入cors模块
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import { AppModule } from './app.module'

// const isDev = process.env.NODE_ENV === 'development'
// FIXME 启用https服务的原因?
async function bootstrap() {
  //   const homeDir = os.homedir()

  //   let httpsOptions: NestApplicationOptions['httpsOptions'] | undefined
  //   if (isDev) {
  // httpsOptions = {
  //   key: fs.readFileSync(`${homeDir}/localhost-key.pem`),
  //   cert: fs.readFileSync(`${homeDir}/localhost.pem`),
  // }
  //   }
  const httpsApp = await NestFactory.create(AppModule, { cors: true })
  // add openapi support: https://docs.nestjs.com/openapi/introduction
  // https://apifox.com/help/api-docs/importing-api/swagger
  // https://github.com/ferdikoomen/openapi-typescript-codegen
  const config = new DocumentBuilder()
    .setTitle('MapleImage')
    .setDescription('The maple admin API description')
    .setVersion(require('../package.json').version)
    .build()
  // swagger json url: <https://127.0.0.1:4003>/api-json

  const document = SwaggerModule.createDocument(httpsApp, config)
  SwaggerModule.setup('api', httpsApp, document)
  httpsApp.setGlobalPrefix('api', { exclude: ['/', '/health'] })
  httpsApp.enableVersioning({
    // type: VersioningType.URI,
    type: VersioningType.HEADER,
    header: 'X-API-VERSION', // 不同的版本类型 https://docs.nestjs.com/techniques/versioning
  })
  httpsApp.use(cors()) // 添加cors中间件
  httpsApp.use(bodyParser.json({ limit: '50mb' }))
  httpsApp.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  httpsApp.enableCors({ origin: '*' })
  const configService = httpsApp.get(ConfigService)

  const port = configService.get<number>('PORT')
  await httpsApp.listen(port, '0.0.0.0')
  console.log(`Application is running on: ${await httpsApp.getUrl()}`)

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
}
bootstrap().catch(console.error)
