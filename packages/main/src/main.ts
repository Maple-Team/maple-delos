import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  const config = new DocumentBuilder()
    .setTitle('MapleImage')
    .setDescription('The maple admin API description')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.setGlobalPrefix('api')
  app.enableVersioning({
    // type: VersioningType.URI,
    type: VersioningType.HEADER,
    header: 'X-API-VERSION', // 不同的版本类型 https://docs.nestjs.com/techniques/versioning
  })
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT')

  await app.listen(port, '0.0.0.0')
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap().catch(console.error)
