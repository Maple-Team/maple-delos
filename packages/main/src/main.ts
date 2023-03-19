import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { WsAdapter } from '@nestjs/platform-ws'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const config = new DocumentBuilder()
    .setTitle('MapleImage')
    .setDescription('The maple admin API description')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.useWebSocketAdapter(new WsAdapter(app)) // NOTE 重要
  app.setGlobalPrefix('api')
  app.enableVersioning({
    // type: VersioningType.URI,
    type: VersioningType.HEADER,
    header: 'X-API-VERSION', // 不同的版本类型 https://docs.nestjs.com/techniques/versioning
  })
  await app.listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
