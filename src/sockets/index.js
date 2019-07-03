import io from 'socket.io-client'
import store from '../stores'
let socket = io('localhost:3000')

console.log(socket)

socket.on('refresh-users', (users) => {
  store.dispatch('refreshUsers', users)
})

export default socket
