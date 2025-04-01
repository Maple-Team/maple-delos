# maple-delos

基于 nest.js 构建的应用集

## deploy

### environment

docker 部署的应用的环境变量通过 docker-compose.yml 文件中的环境变量配置

```sh
pnpm run docker
```

## TODO

- [ ] 一键起全部服务
- [x] 一键部署: docker-compose 实现
- nestjs 的 library 体验
- nestjs 使用 grpc 做跨语言微服务通信
- prisma 做数据库操作实践
- nestjs 接 nacos/etcd/consul 来做服务注册和发现
- nestjs 自定义 tcp 协议通信
- [x] @compodoc/compodoc 生成依赖关系文档
  - 安装依赖
  - `npx @compodoc/compodoc -p tsconfig.json -s -o`
  - [compodoc 文档](https://compodoc.app/guides/options.html)
- swagger 生成文档
- redis 数据结构和使用

### 理解 nestjs 中的各个概念

> 参考 laravel/springboot 中的相关框架的各种概念、使用场景

- 依赖注入
- 模块
- 提供者
- 控制器
- 服务
- 中间件
- 拦截器
- 管道
- 守卫
- 异常过滤器
- 事件/广播
- 任务队列/调度器/定时任务
- database/orm
- testing
- 日志
- 配置
- 环境变量
- 缓存
- 邮件
- 接入第三方服务
- 微服务
- 数据校验
- 权限管理
- 认证
- 授权
- 多租户
- 国际化

#### laravel

[link](https://api.laravel.com/docs/12.x)

- Broadcasting
- Bus

#### spring boot
