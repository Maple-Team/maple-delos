// 1. 读取package.json的version
// 2. docker build
// 3. docker run
const { exec } = require('child_process')
const { version } = require('../package.json')

const name = 'liutsing/delos'
const dockerProcss = exec(`docker build . -t ${name}:latest -t ${name}:${version}`)

dockerProcss.stdout.on('data', (data) => {
  console.log(data)
})
dockerProcss.stderr.on('data', (data) => {
  console.error(data)
})
