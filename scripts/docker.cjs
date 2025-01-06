// const root = process.cwd()
// const path = require('node:path')
const { execSync, exec } = require('node:child_process')

// const { version } = require(path.resolve(root, './package.json'))

const APP_VERSION = execSync('git rev-parse HEAD').toString().trim().slice(0, 8)
// 构建 docker build . --target xx --tag xxx
// 不使用缓存构建 docker build --no-cache . --target xx --tag xxx

// 镜像构建
console.time('liutsing/delos-main')
exec(
  `docker build . --target main --build-arg APP_VERSION=${APP_VERSION} --tag liutsing/delos-main:latest`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(stderr)
      return
    }
    console.log(stdout)
    console.timeEnd('liutsing/delos-main')
  }
)

console.time('liutsing/delos-minio')
execSync(`docker build . --target minio --build-arg APP_VERSION=${APP_VERSION} --tag liutsing/delos-minio:latest`)
console.timeEnd('liutsing/delos-minio')
