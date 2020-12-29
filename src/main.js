import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'

import Home from './pages/Home.vue'
import LoginPage from './pages/LoginPage'
import Room from './pages/Room.vue'
import App from './App.vue'
import SDK from './libs/sdk'
import auth from './libs/auth'
import './libs/mock'
import 'ant-design-vue/dist/antd.css';
import { Layout, List, Avatar, Button, Card, Row, Col, Calendar,Form, Input, Select, message, Badge } from 'ant-design-vue';
Vue.use(Layout)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Button)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Calendar)
Vue.use(Form)
Vue.use(Input)
Vue.use(Select)
Vue.use(Badge)
Vue.use(VueRouter)

const routes = [
  { path: '/', name:'home', component: Home,  meta: { requiresAuth: true }},
  { path: '/room/:id', name: 'room', component: Room },
  { path: '/login', name: 'login', component: LoginPage }
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes // (缩写) 相当于 routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

let appid = 'e5fa72928cae43e0bfa46c196cb91c2d'
try {
  let rtcEngine = new SDK({
    appId: appid,
    role: 1
  })
  Vue.prototype.$sdk = rtcEngine
} catch (e) {
  Vue.prototype.$sdk = null
}
Vue.config.productionTip = false
Vue.prototype.$message = message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
