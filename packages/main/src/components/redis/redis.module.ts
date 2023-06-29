import { Module } from '@nestjs/common'
import { redisStore } from 'cache-manager-redis-store'
import type { RedisClientOptions } from 'redis'
import { CacheModule, CacheStore } from '@nestjs/cache-manager'

const isProd = process.env.NODE_ENV === 'production'
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => {
        // @https://blog.logrocket.com/add-redis-cache-nestjs-app/
        const store = await redisStore({
          socket: {
            host: isProd ? 'maple-redis' : 'localhost',
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
