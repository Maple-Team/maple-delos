import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from './redis.module';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LOG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: isProd ? 'log-microservice' : 'localhost',
          port: 8801,
        },
      },
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: isProd ? 'mqtt://mqtt-server:1883' : 'mqtt://localhost:1883',
        },
      },
    ]),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
