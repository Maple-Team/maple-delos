import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import { TerminusModule } from '@nestjs/terminus'
import { WinstonModule } from 'nest-winston'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { DirectiveLocation, GraphQLDirective } from 'graphql'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { GatewaysModule } from './gateways/gateways.module'
import { HealthModule } from './health/health.module'
import { RequestLoggingMiddleware } from './middleware/request.log.middleware'
import { AuthModule } from './auth/auth.module'
import { GlobalErrorFilter, HttpExceptionFilter, TypeORMErrorFilter } from './filters'
import { CustomTypeormLogger, winstonConfig } from './logger'
import {
  Album,
  AlbumModule,
  BlogModule,
  ControlModule,
  DeviceModule,
  ElectronAppModule,
  Fiction,
  FictionModule,
  Image,
  ImageModule,
  Label,
  LabelModule,
  Locale,
  LocaleModule,
  LzzModule,
  MediaModule,
  MeituluModule,
  MicroserviceTestModule,
  MinioModule,
  MockModule,
  Product,
  ProductsModule,
  Project,
  ProjectsModule,
  RecipesModule,
  RedisModule,
  ScreenshotModule,
  Screenshots,
  SonyoonjooModule,
  SseTestModule,
  Team,
  TeamsModule,
  TimelineModule,
  User,
  UserModule,
  VideoModule,
  upperDirectiveTransformer,
} from './components'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { HeaderInterceptor } from './interceptor/header.interceptor'

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
        const config =
          process.env.USE_MASTER_SLAVE_MYSQL === 'true'
            ? {
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
            : {
                username: 'root',
                host: process.env.MYSQL_HOST,
                port: +process.env.MYSQL_PORT,
                database: 'maple',
                password: 'root',
              }
        return {
          type: 'mysql',
          entities: [Product, Fiction, Label, Image, Album, User, Team, Project, Screenshots, Locale],
          synchronize: true,
          charset: 'utf8mb4',
          // typeorm 日志
          maxQueryExecutionTime: 1000,
          logger: new CustomTypeormLogger(),
          //   debug: true, // 开启debug，太多信息了
          logging: 'all',
          ...config,
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
    {
      provide: APP_FILTER,
      useClass: GlobalErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeORMErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HeaderInterceptor,
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
