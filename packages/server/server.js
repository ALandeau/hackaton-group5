let io = require('socket.io')(3000)
let crypto = require('crypto')
let os = require('os')

console.log('socket server exposed on : 3000')
let connectedUsers = []

io.on('connection', (socket) => {
  socket.on('username', (payload) => {
    if (payload.username === undefined) return
    console.log('New User : ', payload.username)
    connectedUsers.push({
      username: payload.username,
      socket: socket,
      room_id : crypto.randomBytes(10).toString('hex')
    })
    emitUsers()
  })

  socket.on('create-or-join', function (room) {
    let clientsInRoom = io.sockets.adapter.rooms[room]
    console.log('there are clients in room : ', clientsInRoom)
    let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0
    if (numClients === 0) {
      console.log('Client ID ' + socket.id + ' created room ' + room)
      socket.join(room)
      socket.emit('created-room', room, socket.id)
    } else if (numClients === 1) {
      console.log('Client ID ' + socket.id + ' joined room ' + room)
      socket.join(room)
      socket.emit('joined-room', room, socket.id)
    }

    if (numClients === 2) {
      io.sockets.in(room).emit('room-ready')
    }
  })

  socket.on('call_user', (payload) => {
    const user = connectedUsers.find((user) => user.room_id === payload.roomId)
    if(user === undefined) return
    console.log('Calling user : ', user.username)
    log('Calling user : ', user.username)
    if (user) {
      user.socket.emit('incoming_call', {user_room_id : payload.roomId, username : payload.callerName})
    }
  })

  function log () {
    let array = ['Message from server:']
    array.push.apply(array, arguments)
    socket.emit('log', array)
  }

  socket.on('message', function (payload) {
    log('Client said: ', payload.message)
    console.log('Client Message : ', payload.message)
    socket.to(payload.room).emit('message', payload.message)
  })

  socket.on('bye', function () {
    console.log('received bye')
  })

  socket.on('ipaddr', function () {
    let ifaces = os.networkInterfaces()
    for (let dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address)
        }
      })
    }
  })

  socket.on('disconnect', () => {
    emitUsers()
  })
})

function emitUsers () {
  connectedUsers = connectedUsers.filter((user) => {
    return user.socket !== undefined && Object.keys(io.sockets.sockets).indexOf(user.socket.id) !== -1
  })
  io.emit('refresh-users', connectedUsers.map(user => {
    return {
      username: user.username,
      socket_id: user.socket.id,
      room_id: user.room_id
    }
  }))
}
