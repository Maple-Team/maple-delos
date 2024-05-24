import * as path from 'path'
import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import { TerminusModule } from '@nestjs/terminus'
import { WinstonModule } from 'nest-winston'
import { FileTransportOptions } from 'winston/lib/winston/transports'
import * as winston from 'winston'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { MediaModule } from './components/media/media.module'
import { Product } from './components/product/product.entity'
import { ProductsModule } from './components/product/products.module'
import { DeviceModule } from './components/device/device.module'
import { FictionModule } from './components/fiction/fiction.module'
import { LabelModule } from './components/label/label.module'
import { Fiction } from './components/fiction/entities/fiction.entity'
import { Label } from './components/label/entities/label.entity'
import { ImageModule } from './components/gallery/image/image.module'
import { AlbumModule } from './components/gallery/album/album.module'
import { Image } from './components/gallery/image/entities/image.entity'
import { Album } from './components/gallery/album/entities/album.entity'
import { BlogModule } from './components/zyc/blog.module'
import { MockModule } from './components/mock/mock.module'
import { SonyoonjooModule } from './components/sonyoonjoo/sonyoonjoo.module'
import { MeituluModule } from './components/meitulu/meitulu.module'
import { TimelineModule } from './components/timeline/timeline.module'
import { LzzModule } from './components/lzz/lzz.module'
import { GatewaysModule } from './gateways/gateways.module'
import { HealthModule } from './health/health.module'
import { UserModule } from './components/users/user.module'
import { User } from './components/users/entities/user.entity'
import { RequestLoggingMiddleware } from './middleware/request.log.middleware'
import { AuthModule } from './auth/auth.module'
import { RedisModule } from './components/redis/redis.module'
import { ControlModule } from './components/remote-control/control.module'
import { MicroserviceTestModule } from './components/microservice-test/control.module'
import { SseTestModule } from './components/sse-test/sse-test.module'
import { VideoModule } from './components/video/videos.mdoule'
import { MinioModule } from './components/minio/minio.module'
import { LocaleModule, ProjectsModule, ScreenshotModule, TeamsModule } from './components/i18n'
import { Team } from './components/i18n/teams/entities/team.entity'
import { Project } from './components/i18n/projects/entities/project.entity'
import { Screenshots } from './components/i18n/screenshot/entities'
import { Locale } from './components/i18n/locale/entities/locale.entity'

const envFiles = {
  development: '.env.development',
  production: '.env.production',
}
const infoFilePath = path.join(process.cwd(), 'logs', 'info.log')
const errorFilePath = path.join(process.cwd(), 'logs', 'error.log')

// @https://github.com/winstonjs/winston/blob/master/docs/transports.md
const fileOption: FileTransportOptions = {
  maxsize: 1 * 1024 * 1024,
  maxFiles: 100,
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: `mongodb://${process.env.MONGODB_HOST}`,
          connectTimeoutMS: 1000 * 60,
          maxPoolSize: 10,
          dbName: 'maple',
        }
      },
    }),
    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss SSS',
        }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss SSS',
            }),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: infoFilePath,
          level: 'info',
          ...fileOption,
        }),
        // process.env.SHOWLARK_MESSAGE === 'true'
        //   ? new LarkHook({
        //       webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/f44c17ad-06b0-4957-a5be-2b066fcef6ce',
        //       level: 'error',
        //       msgType: 'text',
        //       emitAxiosErrors: true,
        //     })
        //   : null,
      ].filter(Boolean),
      rejectionHandlers: [new winston.transports.File({ filename: errorFilePath, ...fileOption })],
    }),
    RedisModule,
    ConfigModule.forRoot({
      envFilePath: envFiles[process.env.NODE_ENV] || '.env',
    }),
    DeviceModule,
    ProductsModule,
    MediaModule,
    FictionModule,
    LabelModule,
    AlbumModule,
    ImageModule,
    BlogModule,
    GatewaysModule,
    MockModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        return {
          username: 'root',
          type: 'mysql',
          host: process.env.MYSQL_HOST,
          port: 3306,
          database: 'maple',
          password: 'root',
          entities: [Product, Fiction, Label, Image, Album, User, Team, Project, Screenshots, Locale],
          synchronize: true,
        }
      },
    }),
    SonyoonjooModule,
    MeituluModule,
    TimelineModule,
    ControlModule,
    LzzModule,
    TerminusModule,
    HealthModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
    WinstonModule,
    // IoRedisModule.forRootAsync({
    //   useFactory: () => ({
    //     type: 'single',
    //     url: `redis://${process.env.REDIS_HOST}:6379`,
    //   }),
    // }),
    MicroserviceTestModule,
    SseTestModule,
    VideoModule,
    MinioModule,
    TeamsModule,
    ProjectsModule,
    ScreenshotModule,
    LocaleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly service: AppService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*')
  }

  async onModuleInit() {
    // 检查数据库中是否已经存在数据
    const dataExists = await this.service.checkDataExists()

    // 如果数据不存在，则执行插入操作
    if (!dataExists) await this.service.insertData()
  }
}
