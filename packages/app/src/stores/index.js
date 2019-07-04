import Vue from 'vue'
import Vuex from 'vuex'
import socket from '../sockets'

Vue.use(Vuex)

const baseState = {
  username: '',
  users: []
}

const initStore = function () {
  let localStore = localStorage.getItem('store')
  localStore = localStore !== null ? JSON.parse(localStore) : {}
  if (localStore.username !== '') {
    socket.emit('username', {
      username: localStore.username
    })
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
    }
  }
})

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})

export default store
