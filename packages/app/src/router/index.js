import Vue from 'vue'
import Router from 'vue-router'
import store from '../stores'
import Home from '../pages/Home'
import Users from '../pages/Users'
import Call from '../pages/Call'

Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '/call/:user_id',
      name: 'Call',
      component: Call
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.username === '' && to.fullPath !== '/') router.push('/')
  if (store.state.username !== '' && to.fullPath === '/') router.push('/users')
  next()
})

export default router
