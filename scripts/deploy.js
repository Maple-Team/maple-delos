// 1. 读取package.json的version
// 2. docker build
// 3. docker run
const { version } = require('../package.json')
const { exec, execSync } = require('child_process')
const name = 'liutsing/delos'
const dockerProcss = exec(`docker build . -t ${name}:latest -t ${name}:${version}`)

dockerProcss.stdout.on('data', function (data) {
  console.log(data)
})
dockerProcss.stderr.on('data', function (data) {
  console.error(data)
})

dockerProcss.stdout.on('end', function () {
  try {
    execSync(
      `docker ps -q --filter "name=maple-delos" | grep -q . && docker stop maple-delos && docker rm -fv maple-delos`
    )
  } catch (error) {
    // 无docker运行会报错
  }
  // 可以不用暴露出来
  exec(
    `docker run -itd -p 3001:3000 --name maple-delos --link maple-mysql --link maple-mongodb --net maple-network  liutsing/delos:latest`,
    (e, stdout, stderr) => {
      if (e) {
        throw e
      } else {
        if (stderr) {
          console.error(stderr)
        } else {
          console.log('docker run success!')
        }
      }
    }
  )
})
