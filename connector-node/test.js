/**
 * 测试代码
 */


const exec = require('child_process').exec
const concurrency = 300

for (let i = 0; i < concurrency; i++) {
  const from = '用户' + i
  const to = '用户' + (i + 1) % concurrency
  const cmd = `node client.js ${from} ${to}`
  exec(cmd, function(err,stdout){
    if(err) { console.log(err)}
    console.log(stdout);
  })
}
