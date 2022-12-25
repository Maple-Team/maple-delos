import { Module, CacheModule, CacheStore } from '@nestjs/common'
import { redisStore } from 'cache-manager-redis-store'
import type { RedisClientOptions } from 'redis'

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => {
        // @https://blog.logrocket.com/add-redis-cache-nestjs-app/
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
            // NOTE default databases: 0
          },
        })

        return {
          store: {
            create: () => store as unknown as CacheStore,
          },
          ttl: 60 * 60 * 24 * 7, // 1 week
        }
      },
    }),
  ],
})
export class RedisModule {}
