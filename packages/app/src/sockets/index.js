import io from 'socket.io-client'
import store from '../stores'
// import router from '../router'

let socket = io('localhost:5000')

export const startCall = function (userId) {
  socket.emit('call-user', userId)
}

export default socket

socket.on('incoming_call', (payload) => {
  store.dispatch('incomingCall', {
    user_room_id: payload.user_room_id,
    username: payload.username
  })
})

socket.on('refresh-users', (users) => {
  store.dispatch('refreshUsers', users)
})
