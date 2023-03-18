const { version, name: packageName } = require('../package.json');
const { exec } = require('child_process');

const [_, name] = packageName.split('/');
const imageName = `liutsing/${name}`;

const dockerProcss = exec(
  `docker build . -t ${imageName}:latest -t ${imageName}:${version}`,
);

dockerProcss.stdout.on('data', function (data) {
  console.log(data);
});
dockerProcss.stderr.on('data', function (data) {
  console.error(data);
});
