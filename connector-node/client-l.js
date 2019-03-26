var net = require("net")
var host = process.env.host || "127.0.0.1"
var port = process.env.port || 8125
var Message = require("./message")

var seq = 0
var intervalID

connect = (host, port, username, toUser)=>{
  var client
  client = net.connect({
    port: port,
    host: host
  }, ()=>{
    //心跳消息
    client.write(genHBMsg().toChunk())

    //登录消息
    client.write(genLoginMsg().toChunk())

    intervalID = setInterval(()=>{
      //发送推送消息
      client.write(genNewMsg(username, toUser).toChunk())
    }, 5 * 1000)

  })

  client.on("data", (chunk)=>{
    var message = Message.ReadMessage(chunk)
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

connect(host, port, 'liu', 'wang')
