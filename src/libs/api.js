import Axios from 'axios'
import { message } from 'ant-design-vue'
import qs from 'qs'

const axios  = Axios.create({
  baseURL: 'http://47.95.218.174/rmt/api',
  timeout: 3000
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  message.error('服务器错误')
  return Promise.reject(error);
});

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.method == 'post') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    console.log('config', config)
    config.data = qs.stringify(config.data);//对参数进行序列化
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


export default axios