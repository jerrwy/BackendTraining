var net = require("net")
var fs = require('fs')
var host = process.env.host || "127.0.0.1"
var port = process.env.port || 8125
var Message = require("./message")

var seq = 0
var msgCount = 0
var msgHash = {}

connect = (host, port, username, toUser)=>{
  var client
  var intervalID
  client = net.connect({
    port: port,
    host: host
  }, ()=>{
    //心跳消息
    // client.write(genHBMsg().toChunk())

    //登录消息
    client.write(genLoginMsg().toChunk())

    setTimeout(() => {
      intervalID = setInterval(()=>{
        //发送推送消息
        const msg = genNewMsg(username, toUser)
        if (msg.seq) {
          msgHash[msg.seq] = { start: new Date().getTime() }
        }
        msgCount++
        client.write(msg.toChunk())
      }, 3 * 1000)
    }, 5 * 1000)

  })

  client.on("data", (chunk)=>{
    var message = Message.ReadMessage(chunk)
    if(msgHash[message.seq]) {
      msgHash[message.seq].end = new Date().getTime()
    }
    console.log('rev:', JSON.stringify(message))
  })

  client.on("end", ()=>{
    console.log("end")
    clearInterval(intervalID)
  })

  client.on("error", (error)=>{
    console.log("error", error)
    clearInterval(intervalID)
  })

  function genHBMsg () {
    var message = new Message()
    message.seq = seq++
    message.cmd = Message.Type.HB
    message.content = "心跳起来"
    return message
  }

  function genLoginMsg () {
    var message = new Message()
    message.seq = seq++
    message.cmd = Message.Type.Login
    message.content = JSON.stringify({username})
    return message
  }

  function genNewMsg (from, to) {
    var message = new Message()
    message.seq = seq++
    message.cmd = Message.Type.NewMsg
    var msg = {
      from,
      to,
      type: 2,
      content: `${to}你好， 我叫${from}!`,
      datetime: new Date().getTime()
    }
    message.content = JSON.stringify(msg)
    return message
  }
}

// const [from, to] = process.argv.slice(2)
// connect(host, port, from, to)


const concurrency = 600

let interval = 5 * 1000 / concurrency

let count = 0

let timer = setInterval(() => {
  const from = '用户' + count
  const to = '用户' + (count + 1) % concurrency
  connect(host, port, from, to)
  count++
  if(count > concurrency) clearInterval(timer)
}, interval)

// for (let i = 0; i < concurrency; i++) {
//   setTimeout(() => {
//     const from = '用户' + i
//     const to = '用户' + (i + 1) % concurrency
//     connect(host, port, from, to)
//   }, i)
//   // const from = '用户' + i
//   // const to = '用户' + (i + 1) % concurrency
//   // connect(host, port, from, to)
// }


setInterval(()=>{
  logMonitorInfo()
}, 1000)

function logMonitorInfo () {
  const pid = process.pid
  const arr = Object.keys(msgHash).map(k => msgHash[k].end - msgHash[k].start).filter(k => !!k)
  const data = `${new Date().getTime()} ${pid} ${avg(arr).toFixed(2)} ${min(arr)} ${max(arr)} ${msgCount} ${concurrency}\n`
  msgHash = {}
  msgCount = 0
  fs.appendFile('./clientLog.txt', data, 'utf8', () =>{})
}

function min (arr) {
  return arr.length > 0 ? Math.min(...arr) : 0
}

function max (arr) {
  return arr.length > 0 ? Math.max(...arr) : 0
}

function avg (arr) {
  return arr.length > 0 ? arr.reduce((a,b) => a+b, 0) / arr.length : 0
}
