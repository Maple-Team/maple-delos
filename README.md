

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

https://www.mmdaobaobei.com/xh/

代码中接收docker传入的参数
- sh写文件
```yaml
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
        name: maple-network%
```
### Entity vs DTO