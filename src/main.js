import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './Home.vue'
import Room from './Room.vue'
import App from './App.vue'
import SDK from './libs/sdk'
import 'ant-design-vue/dist/antd.css';
import { Layout, List, Avatar, Button } from 'ant-design-vue';
Vue.use(Layout)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Button)
Vue.use(VueRouter)

const routes = [
  { path: '/', name:'home', component: Home },
  { path: '/root', name: 'room', component: Room }
]

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes // (缩写) 相当于 routes: routes
})

let appid = '3895205a5985414ea176204fcb1f63a4'
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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
