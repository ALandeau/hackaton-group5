import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './stores'
import socket from './sockets'

Vue.use(Vuex)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  socket,
  template: '<App/>',
  components: {App}
})
