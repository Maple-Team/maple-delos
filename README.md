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
- https://docs.nestjs.com/techniques/performance 性能优化
- https://docs.nestjs.com/techniques/versioning 版本控制
- https://docs.nestjs.com/fundamentals/lifecycle-events 生命周期事件
- https://docs.nestjs.com/fundamentals/discovery-service 服务发现
- https://docs.nestjs.com/security/csrf csrf 防御
- https://api-references-nestjs.netlify.app/api api 文档
- https://docs.nestjs.com/fundamentals/testing#end-to-end-testing e2e 测试

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

## misc

> 下面加了注释的话，会报错： WARN  Issue while reading "C:\Users\liuts\Code\walle\maple-delos\.npmrc". Failed to replace env in config: ${version}

### npmrc 配置代理

```sh
NODEJS_ORG_MIRROR="https://cdn.npmmirror.com/binaries/node"
NVM_NODEJS_ORG_MIRROR="https://cdn.npmmirror.com/binaries/node"
PHANTOMJS_CDNURL="https://cdn.npmmirror.com/binaries/phantomjs"
CHROMEDRIVER_CDNURL="https://cdn.npmmirror.com/binaries/chromedriver"
OPERADRIVER_CDNURL="https://cdn.npmmirror.com/binaries/operadriver"
ELECTRON_MIRROR="https://cdn.npmmirror.com/binaries/electron/"
ELECTRON_BUILDER_BINARIES_MIRROR="https://cdn.npmmirror.com/binaries/electron-builder-binaries/"
SASS_BINARY_SITE="https://cdn.npmmirror.com/binaries/node-sass"
SWC_BINARY_SITE="https://cdn.npmmirror.com/binaries/node-swc"
NWJS_URLBASE="https://cdn.npmmirror.com/binaries/nwjs/v"
PUPPETEER_DOWNLOAD_HOST="https://cdn.npmmirror.com/binaries"
SENTRYCLI_CDNURL="https://cdn.npmmirror.com/binaries/sentry-cli"
SAUCECTL_INSTALL_BINARY_MIRROR="https://cdn.npmmirror.com/binaries/saucectl"
npm_config_sharp_binary_host="https://cdn.npmmirror.com/binaries/sharp"
npm_config_sharp_libvips_binary_host="https://cdn.npmmirror.com/binaries/sharp-libvips"
npm_config_robotjs_binary_host="https://cdn.npmmirror.com/binaries/robotj"
CYPRESS_DOWNLOAD_PATH_TEMPLATE='https://cdn.npmmirror.com/binaries/cypress/${version}/${platform}-${arch}/cypress.zip'
```

## Temp Reading List

- https://github.com/nailyjs/Nai-Six
- https://github.com/mx-space/core
