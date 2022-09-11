import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from './components/media/media.module';
import { Product } from './components/product/product.entity';
import { ProductsModule } from './components/product/products.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      connectTimeoutMS: 1000 * 60,
      maxPoolSize: 10,
      dbName: 'maple',
    }),
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'maple',
      entities: [Product],
      synchronize: true,
    }),
    ProductsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
