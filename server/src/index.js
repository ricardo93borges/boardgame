const express = require('express')
const cors = require('cors')
const jsonHelper = require('./helpers/jsonHelper')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const port = 3000

app.use(cors())
app.use(express.json())

io.on('connection', socket => {  
  
  //Save client orgin on ip list
  if(jsonHelper.getIps().length < 2) {
    let ip = socket.handshake.headers.origin
    jsonHelper.storeIp(ip)
    console.log(`${ip} connected`)
    io.emit('players online', {playersOnline: jsonHelper.getIps().length})
  }

  //Check if theres two clients connected to start the game
  let ips = jsonHelper.getIps()
  if(ips.length == 2){
    io.emit('start game', {ips})
  }

  socket.on('move', (data) => {
    console.log('move', data)
    io.emit('move', {player: socket.handshake.headers.origin, ...data})
  })

  socket.on('win', (data) => {
    console.log('win', data)
    io.emit('win', {player: socket.handshake.headers.origin, ...data})
  })

  socket.on('disconnect', () => {
    let ip = socket.handshake.headers.origin
    //remove client from ip list
    jsonHelper.removeIp(ip)
    console.log(`${ip} disconnected`)

    //Warn player that his adversary left
    io.emit('adversary left', {adversaryIp: ip})
    io.emit('players online', {playersOnline: jsonHelper.getIps().length})
  })

})

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
})