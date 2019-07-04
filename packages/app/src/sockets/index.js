import io from 'socket.io-client'
import store from '../stores'
import router from '../router'

let socket = io('localhost:3000')

export const startCall = function (userId) {
  socket.emit('call-user', userId)
}

export default socket

socket.on('accept-call', (payload) => {
  router.push({
    name: 'Call',
    params: {user_id: payload.socket_id}
  })
})

socket.on('refresh-users', (users) => {
  store.dispatch('refreshUsers', users)
})
