import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import bodyParser from 'body-parser'
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
  // NOTE 激活class-validator验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 去除所有不在验证白名单上的属性
      forbidNonWhitelisted: false, // true: 如果存在不在验证白名单上的属性，则抛出错误，这可以防止客户端发送额外的字段，从而增强数据的安全性
        transform: true, //  会自动将请求体中的数据转换为 DTO 类的实例
        transformOptions: {
          // NOTE 允许自定义 class-transformer 的行为
          enableImplicitConversion: true, // 启用隐式转换
          excludePrefixes: ['_'], // 排除以 _ 开头的字段
          exposeDefaultValues: true, // 暴露默认值
          exposeUnsetFields: false, // 暴露未设置的字段
          enableCircularCheck: true, // 启用循环检查
        },
      stopAtFirstError: true, // 每个字段遇到第一个错误时停止验证
      validationError: {
        target: false, // 不包含目标对象
        value: true, // 不包含验证失败的值 可以避免在错误响应中暴露原始数据
      },
      exceptionFactory: (errors) => {
        // 自定义错误响应
        const messages = errors.map((err) => {
          const field = err.property // 字段名
        //   const value = err.value // 字段值
          // { isString: 'content must be a string', isNotEmpty: '树洞内容不能为空' }
          // { isEnum: '树洞类型必须是 timeline 或 treehole', isNotEmpty: '树洞类型不能为空' }
          const constraints = Object.values(err.constraints) // NOTE 错误消息: constraints是一个对象，包含了所有的错误消息
          return { field, messages: constraints }
        })
        return new BadRequestException({ errors: messages })
      },
    })
  )

  // API配置
  app.setGlobalPrefix('api', {
    exclude: ['/', '/health'],
  })
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-VERSION',
  })
  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('MapleImage')
    .setDescription('The maple admin API description')
    .setVersion(require('../package.json').version)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  // swagger api 列表: http://localhost:4003/api/docs
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    // swagger api json: http://localhost:4003/api/swagger/json
    jsonDocumentUrl: 'swagger/json',
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
