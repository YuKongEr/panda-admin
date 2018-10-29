import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../store'
import {
  getToken
} from '@/utils/auth'
import errorCode from '@/const/errorCode'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.common['Authorization'] = 'Bearer ' + store.getters.token // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    const errMsg = error.toString()
    const code = errMsg.substr(errMsg.indexOf('code') + 5)
    Message({
      message: errorCode[code] || errorCode['default'],
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
