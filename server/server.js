let io = require('socket.io')(3000)
console.log('socket server exposed on : 3000')
const anonymousUsers = []
const connectedUsers = []
io.on('connection', (socket) => {
  console.log('New Connection : ', socket.id)
  anonymousUsers.push(socket)

  socket.on('username', (payload) => {
    connectedUsers.push({
      username: payload.username,
      socket: anonymousUsers.splice(anonymousUsers.indexOf(socket), 1)
    })
    emitUsers()
  })

  socket.on('disconnect', () => {
    connectedUsers.splice(connectedUsers.findIndex(user => user.socket === socket), 1)
    emitUsers()
  })
})

function emitUsers () {
  console.log('new user lists : ', connectedUsers.map(user => {
    return {
      username: user.username,
      socket_id: user.socket.id
    }
  }))
  io.emit('refresh-users', connectedUsers.map(user => {
    return {
      username: user.username,
      socket_id: user.socket.id
    }
  }))
}
