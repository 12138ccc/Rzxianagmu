// 实现对axios
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// 通过axios 创建axios实例

const TimeOut = 1
function IscheckTimeOut() {
  const currentTime = Date.now() // 时间2 真正的时间
  const timeStamp = (currentTime - store.getters.hrsassTime) / 1000
  return timeStamp > TimeOut // true 超时 / 超时
}
// 对比时间是否超时
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 时间2-时间1 >token 超时的时间==》token登录失效
    if (IscheckTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 超时'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  console.log(response)
  const { success, message, data } = response.data
  if (success) { // 业务逻辑成功
    return data
  }
  // 业务逻辑没有成功
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  console.log(error.message)
  if (error.response && error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('token 超时')
  } else {
    Message.error(error.message)
  }

  return Promise.reject(error)
})
export default service
