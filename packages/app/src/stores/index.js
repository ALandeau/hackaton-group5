import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../sockets'

Vue.use(Vuex)

const baseState = {
  username: '',
  users: [],
  incomingCall: false,
  caller: ''
}

const initStore = function () {
  let localStore = localStorage.getItem('store')
  localStore = localStore !== null ? JSON.parse(localStore) : {}
  if (localStore.username !== '') {
    socket.emit('username', {
      username: localStore.username
    })

    localStore.caller = ''
    localStore.incomingCall = false
  }
  return {...baseState, ...localStore}
}

const store = new Vuex.Store({
  state: initStore(),
  mutations: {
    USERNAME (state, username) {
      state.username = username
    },
    USERS (state, users) {
      Vue.set(state, 'users', users)
    },
    INCOMING_CALL (state, payload) {
      state.incomingCall = true
      Vue.set(state, 'caller', payload)
    },
    RESET_CALL_INFO (state) {
      state.incomingCall = false
      Vue.set(state, 'caller', {})
    }
  },
  getters: {},
  actions: {
    submitUsername ({commit}, username) {
      commit('USERNAME', username)
      socket.emit('username', {
        username
      })
    },
    refreshUsers ({commit}, users) {
      commit('USERS', users)
    },
    incomingCall ({state, commit}, payload) {
      console.log('sate payload : ', payload)
      console.log('incomin call from : ', payload.username)
      commit('INCOMING_CALL', {
        room_id: payload.user_room_id,
        username: payload.username
      })
    },
    acceptCall ({commit}) {
      commit('RESET_CALL_INFO')
    }
  }
})

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})

export default store
