# Cache-Manager

可支持多种缓存方式的缓存管理工具包，支持多种缓存方式，如内存缓存、Redis 缓存、MongoDB 缓存等。

## docs

### Interceptor

- `CacheInterceptor`

### Module

- `CacheModule`

### Interface

- `CacheStore`
- `CacheStoreFactory`
- `CacheOptionsFactory`
- `CacheModuleAsyncOptions`

### Decorator

- `CacheKey`
- `CacheTTL`

## Nestjs 中使用 redis 的几种方式

### 1. 使用 cache-manager 内部连接 redis

> 仅需缓存功能（如 get/set、TTL 管理），不需要复杂 Redis 操作

[LINK](./cache-redis.module.ts)

### 2. 使用 provider 的方式连接 redis

> 灵活但繁琐，需要手动管理 Redis 连接和断开

```js
  {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          database: 2,
        })
        await client.connect()
        return client
      },
    },
```

### 3. 使用 module 的方式连接 redis

[doc](https://www.npmjs.com/package/@nestjs-modules/ioredis)

```js
  IoRedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: `redis://${process.env.REDIS_HOST}:6379`,
      }),
    }),
```

## misc

​​

- `node-redis`​​ 将成为 Redis 官方唯一长期演进的客户端，​​ioredis 仅修复关键 BUG​​。

- 如果项目强依赖 `ioredis` 的集群特性，可暂时保留，但需计划向 `node-redis` + 集群插件 迁移
