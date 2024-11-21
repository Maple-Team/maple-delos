import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import { TerminusModule } from '@nestjs/terminus'
import { WinstonModule } from 'nest-winston'
import { APP_FILTER } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { DirectiveLocation, GraphQLDirective } from 'graphql'
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
import { VideoModule } from './components/video/videos.module'
import { MinioModule } from './components/minio/minio.module'
import { LocaleModule, ProjectsModule, ScreenshotModule, TeamsModule } from './components/i18n'
import { Team } from './components/i18n/teams/entities/team.entity'
import { Project } from './components/i18n/projects/entities/project.entity'
import { Screenshots } from './components/i18n/screenshot/entities'
import { Locale } from './components/i18n/locale/entities/locale.entity'
import { ElectronAppModule } from './components/electron-app/electron-app.module'
import { GlobalErrorFilter } from './filters/global-exception.filter'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter'
import { CustomTypeormLogger, winstonConfig } from './logger'
import { RecipesModule } from '@/components/graphql/recipes/recipes.module'
import { upperDirectiveTransformer } from '@/components/graphql/common/directives/upper-case.directive'

const envFiles = {
  development: '.env.development',
  production: '.env.production',
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
    WinstonModule.forRoot(winstonConfig),
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
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'mysql',
          // 单个数据库配置
          //   username: 'root',
          //   host: process.env.MYSQL_HOST,
          //   port: 3306,
          //   database: 'maple',
          //   password: 'root',
          entities: [Product, Fiction, Label, Image, Album, User, Team, Project, Screenshots, Locale],
          synchronize: true,
          charset: 'utf8mb4',
          // typeorm 日志
          maxQueryExecutionTime: 1000,
          //   logger: 'file',
          logger: new CustomTypeormLogger(),
          //   debug: true, // 开启debug，太多信息了
          logging: ['query', 'error'],
          // 主从数据库配置
          replication: {
            master: {
              host: process.env.MYSQL_MASTER_HOST,
              port: +process.env.MYSQL_MASTER_PORT,
              username: 'root',
              password: 'root',
              database: 'maple',
            },
            slaves: [
              {
                host: process.env.MYSQL_SLAVE1_HOST,
                port: +process.env.MYSQL_SLAVE1_PORT,
                username: 'root',
                password: 'root',
                database: 'maple',
              },
              {
                host: process.env.MYSQL_SLAVE2_HOST,
                port: +process.env.MYSQL_SLAVE2_PORT,
                username: 'root',
                password: 'root',
                database: 'maple',
              },
            ],
          },
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
    ElectronAppModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // global-scoped filters

    {
      provide: APP_FILTER,
      useClass: GlobalErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
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
