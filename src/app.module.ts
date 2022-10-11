import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from './components/media/media.module';
import { Product } from './components/product/product.entity';
import { ProductsModule } from './components/product/products.module';
import { DeviceModule } from './components/device/device.module';
import { FictionModule } from './components/fiction/fiction.module';
import { LabelModule } from './components/label/label.module';
import { Fiction } from './components/fiction/entities/fiction.entity';
import { Label } from './components/label/entities/label.entity';
import { EventsModule } from './events/events.module';
// import { BullModule } from '@nestjs/bull';
import { ImageModule } from './components/gallery/image/image.module';
import { AlbumModule } from './components/gallery/album/album.module';
import { Image } from './components/gallery/image/entities/image.entity';
import { Album } from './components/gallery/album/entities/album.entity';
import { getEnvPath } from './config/helper/env.help';

const isProd = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          uri: isProd
            ? 'mongodb://maple-mongodb:27017'
            : 'mongodb://localhost:27017',
          connectTimeoutMS: 1000 * 60,
          maxPoolSize: 10,
          dbName: 'maple',
        };
      },
    }),
    ConfigModule.forRoot({
      envFilePath: getEnvPath(`${__dirname}/config/envs`),
      isGlobal: true,
    }),
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    DeviceModule,
    ProductsModule,
    MediaModule,
    FictionModule,
    LabelModule,
    EventsModule,
    AlbumModule,
    ImageModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          username: 'root',
          type: 'mysql',
          host: isProd ? 'maple-mysql' : 'localhost',
          port: 3306,
          database: 'maple',
          password: '',
          entities: [Product, Fiction, Label, Image, Album],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
