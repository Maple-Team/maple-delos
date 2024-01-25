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
