## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## FAQs

### soft delete

- https://dev.to/vborodulin/how-to-mongoose-soft-delete-plugin-4pf3
- https://masteringjs.io/tutorials/mongoose/soft-delete
- https://github.com/nour-karoui/mongoose-soft-delete/tree/main/src

### Entity vs DTO

## deploy

> 传入 host 等信息

> 参考 yml 配置示例

```yml
version: '2'
services:
  phpmyadmin:
    image: docker.io/bitnami/phpmyadmin:5
    ports:
      - '9080:8080'
    environment:
      - DATABASE_HOST=maple-mysql
      - PMA_HOST=maple-mysql
networks:
  default:
    name: maple-network
```

```sh
docker build . -t liutsing/delos:latest
docker run -itd -p 3001:3000 --name maple-delos --link maple-mysql --link maple-mongodb --net maple-network  liutsing/delos:latest
```

or

```sh
docker-compose up -d
```

## TODO

- mqtt ?
- ws microservice

## Misc

- [socketio-client-tool](https://amritb.github.io/socketio-client-tool/), test socket.io server

### Your Development with Essential Packages and Tools

1. Utils-decorators
2. Typescript-collections
3. Nestjs-i18n
4. Inversify
5. Shx & Shelljs
6. Husky
7. Autocannon
8. Nodemailer
9. Puppeteer
10. @nestjs/terminus
11. @swc/cli and @swc/core
12. Concurrently
13. @compodoc/compodoc
14. Nest-commander
15. Geolib & Turfjs:"

## environment

> .env.development

```conf
REDIS_HOST=localhost
MONGODB_HOST=localhost:27017
PORT=4003
REMOTE_CONTROL_SERVICE=control-microservice
LOG_SERVICE=log-microservice
MQTT_SERVICE=mqtt-server:1883
MQTT_SERVICE_CLIENT_ID=nestjs-rc-client
MINIO_SERVICE=nestjs-minio
# 主从配置
MYSQL_MASTER_HOST=mysql-master
MYSQL_MASTER_PORT=3306
MYSQL_SLAVE1_HOST=mysql-slave1
MYSQL_SLAVE1_PORT=3306
MYSQL_SLAVE2_HOST=mysql-slave2
MYSQL_SLAVE2_PORT=3306
# 是否使用主从配置
USE_MASTER_SLAVE_MYSQL=false
MYSQL_HOST=localhost
MYSQL_PORT=3306

```
