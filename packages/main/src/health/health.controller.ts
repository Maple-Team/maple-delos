import { Controller, Get } from '@nestjs/common'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { RedisOptions, Transport } from '@nestjs/microservices'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private mongodb: MongooseHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    // private dogHealthIndicator: DogHealthIndicator,
    private microservice: MicroserviceHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      //   () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.http.pingCheck('http', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
      () => this.mongodb.pingCheck('mongodb', { timeout: 1500 }),
      //   () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }), FIXME 路径问题
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      //   () => this.dogHealthIndicator.isHealthy('dog'),
      // tcp微服务
      //   async () =>
      //     this.microservice.pingCheck<TcpClientOptions>('tcp', {
      //       transport: Transport.TCP,
      //       options: { host: 'localhost', port: 8889 },
      //     }),
      async () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: {
            host: 'localhost',
            port: 6379,
          },
        }),
    ])
  }
}
