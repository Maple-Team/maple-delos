import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
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
import { RedisModule } from './components/redis/redis.module'
import { SonyoonjooModule } from './components/sonyoonjoo/sonyoonjoo.module'
import { MeituluModule } from './components/meitulu/meitulu.module'
import { TimelineModule } from './components/timeline/timeline.module'
import { ControlModule } from './components/remote-control/control.module'
import { LzzModule } from './components/lzz/lzz.module'
import { EventsModule } from './events/events.module'

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
    RedisModule,
    ConfigModule.forRoot({
      envFilePath: envFiles[process.env.NODE_ENV] || '.env',
    }),
    DeviceModule,
    ProductsModule,
    MediaModule,
    FictionModule,
    LabelModule,
    EventsModule,
    AlbumModule,
    ImageModule,
    BlogModule,
    MockModule,
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
          password: '',
          entities: [Product, Fiction, Label, Image, Album],
          synchronize: true,
        }
      },
    }),
    SonyoonjooModule,
    MeituluModule,
    TimelineModule,
    ControlModule,
    LzzModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
