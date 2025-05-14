const path = require('node:path')
const root = process.cwd()
const { execSync, exec } = require('node:child_process')
const { writeFile } = require('node:fs')
const os = require('node:os')

const { version } = require(path.resolve(root, './package.json'))
const isWin = os.platform() === 'win32'
writeFile(path.resolve(root, './.env'),
  isWin ?
    // windows minio server
    `
VERSION=${version}
MINIO_ACCESS_KEY=e68Cu2Fybl0KKJEs5i67
MINIO_SECRET_KEY=ztHk5Z4tGLnYaiobFfD5cVfDN5R7pQtmyvc2MaUs
`:
    // mac  minio server
    `
VERSION=${version}
MINIO_ACCESS_KEY=363wbyRsqOAsWXt7jsWB
MINIO_SECRET_KEY=sUjdiu0xgCiGwwdFCsrG4YDR1u1xepC7KxjQqgZg
`
  , (err) => {
    if (err) {
      console.error(err)
    }
  })
const APP_VERSION = execSync('git rev-parse HEAD').toString().trim().slice(0, 8)
// 构建 docker build . --target xx --tag xxx
// 不使用缓存构建 docker build --no-cache . --target xx --tag xxx

// 镜像构建
console.time('liutsing/delos-main')
exec(
  `docker build . --target main --build-arg APP_VERSION=${APP_VERSION} --tag liutsing/delos-main:${version}`,
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
exec(`docker build . --target minio --tag liutsing/delos-minio:${version}`, (err, stdout, stderr) => {
  if (err) {
    console.error(stderr)
    return
  }
  console.log(stdout)
  console.timeEnd('liutsing/delos-minio')
})

console.time('liutsing/service-puppeteer')
exec(`docker build . --target puppeteer --tag liutsing/service-puppeteer:${version}`, (err, stdout, stderr) => {
  if (err) {
    console.error(stderr)
    return
  }
  console.log(stdout)
  console.timeEnd('liutsing/service-puppeteer')
})
