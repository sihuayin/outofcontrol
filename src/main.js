import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import config from './config/config'

import Home from './pages/Home.vue'
import LoginPage from './pages/LoginPage'
import Room from './pages/Room.vue'
import Loading from './pages/Loading.vue'
import Vistor from './pages/Vistor.vue'
import OneApply from './pages/OneApply'
import VideoList from './pages/VideoList'
import VideoInfo from './pages/VideoInfo'
import DatingPage from './pages/DatingPage'
import TestPage from './pages/TestPage'
import ZhuanjiaRoom from './pages/ZhuanjiaRoom'
import App from './App.vue'
import SDK from './libs/sdk'
import auth from './libs/auth'
// import './libs/mock'
import 'ant-design-vue/dist/antd.css';
import './assets/index.less'
import {
  Layout,
  List,
  Avatar,
  Button,
  Card,
  Row,
  Col,
  Calendar,
  Form,
  Input,
  Select,
  message,
  Badge,
  Spin,
  Icon,
  Modal,
  Space,
  Upload,
  Dropdown,
  Menu,
  Table,
  Divider,
  Tag
} from 'ant-design-vue';

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
Vue.use(Spin)
Vue.use(Icon)
Vue.use(Modal)
Vue.use(Space)
Vue.use(Upload)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Table)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(VueRouter)

const routes = [
  { path: '/', name:'loading', component: Loading,  meta: { requiresAuth: true }},
  { path: '/test', name:'test', component: TestPage,  meta: { requiresAuth: true }},
  { path: '/vistor', name:'vistir', component: Vistor,  meta: { requiresAuth: true }},
  { path: '/home', name:'home', component: Home,  meta: { requiresAuth: true }},
  { path: '/room/:id', name: 'room', component: Room },
  { path: '/zhuanjia_room/:id', name: 'zhuanjia_room', component: ZhuanjiaRoom },
  { path: '/oneapply', name: 'oneapply', component: OneApply },
  { path: '/videolist', name: 'videolist', component: VideoList },
  { path: '/videoinfo', name: 'videoinfo', component: VideoInfo },
  { path: '/dating', name: 'dating', component: DatingPage },
  { path: '/login', name: 'login', component: LoginPage }
]

const router = new VueRouter({
  mode: 'hash',
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

try {
  let rtcEngine = new SDK({
    appId: config.appID,
    role: 2,
    logPath: './error.txt'
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
