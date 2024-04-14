import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'

const envFiles = {
  development: '.env.development',
  production: '.env.production',
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFiles[process.env.NODE_ENV] || '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
