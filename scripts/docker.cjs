const root = process.cwd()
const path = require('node:path')
const { execSync } = require('node:child_process')
/**
 * 

ERROR: "docker buildx build" requires exactly 1 argument.
See 'docker buildx build --help'.

Usage:  docker buildx build [OPTIONS] PATH | URL | -

Start a build
node:child_process:965
    throw err;
    ^

Error: Command failed: docker build . --target main --tag liutsing/delos-main:latest liutsing/delos-main:0.1.0
ERROR: "docker buildx build" requires exactly 1 argument.
See 'docker buildx build --help'.

Usage:  docker buildx build [OPTIONS] PATH | URL | -

Start a build


 */
const { version } = require(path.resolve(root, './package.json'))

// 构建 docker build . --target xx --tag xxx
// 不使用缓存构建 docker build --no-cache . --target xx --tag xxx

// 镜像构建
console.time('liutsing/delos-main')
execSync(`docker build . --target main --tag liutsing/delos-main:latest liutsing/delos-main:${version}`)
console.timeEnd('liutsing/delos-main')

console.time('liutsing/delos-minio')
execSync(`docker build --no-cache  . --target minio --tag liutsing/delos-minio:latest liutsing/delos-minio:${version}`)
console.timeEnd('liutsing/delos-minio')
