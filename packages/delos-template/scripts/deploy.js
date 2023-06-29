const { exec } = require('child_process')
const { version, name: packageName } = require('../package.json')

const [_, name] = packageName.split('/')
const imageName = `liutsing/${name}`

const dockerProcss = exec(`docker build . -t ${imageName}:latest -t ${imageName}:${version}`)

dockerProcss.stdout.on('data', (data) => {
  console.log(data)
})
dockerProcss.stderr.on('data', (data) => {
  console.error(data)
})
