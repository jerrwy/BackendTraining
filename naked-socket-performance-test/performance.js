// Generated by CoffeeScript 1.12.7
var connect, connectionCount, count, diffArray, host, map, max, measureUp, net, port, powerUp

net = require("net")

host = process.env.host || "127.0.0.1"
port = process.env.port || 8124

count = process.env.count || 2000
reqDuration = 5000

diffArray = []
map = {}
max = 0

connectionCount = 0

connect = (host, port) => {
  var client
  client = net.connect({
    port: port,
    host: host
  }, () => {
    connectionCount++
    client.write("HB:01234567890123456789")
    setInterval(() => {
      var start, ticker
      start = Date.now()
      map[start] = start
      client.write("RQ:" + start + "-012345678901234567890123456789")
      ticker = Date.now()
    }, reqDuration)
  })

  client.on("data", (chunk) => {
    var diff, start
    start = parseInt(chunk.toString("utf8", 3, 16))
    diff = Date.now() - start
    if (diff > max) {
      max = diff
    }
    diffArray.push(diff)
  })

  client.on("end", () => {
    console.log("end")
    connectionCount--
  })

  client.on("error", (error) => {
    console.log("error", error)
  })
}

powerUp = () => {
  for (var i = 0;i<count;i++) {
    setTimeout(() => {
      connect(host, port)
    }, i * 20 / count * 1000)
  }
}

measureUp = () => {
  setTimeout(() => {
    setInterval(() => {
      var avg, len, sum
      sum = 0
      len = diffArray.length
      diffArray.forEach((item) => {
        sum += item
      })
      avg = sum / len
      diffArray = []
      console.log("pid:" + process.pid + ",avg:" + avg + ", max:" + max + ", msg:" + len + ", con:" + connectionCount + ", \ntime:" + (new Date()))
      max = 0
    }, 5000)
  }, (5 - Date.now() / 1000 % 5) * 1000)
}

powerUp()
measureUp()