import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Users from '../pages/Users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    }
  ]
})
