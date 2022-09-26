// 实现对axios
import axios from 'axios'
import { Message } from 'element-ui'
// 通过axios 创建axios实例

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  timeout: 5000
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
  Message.error(error.message)
  return Promise.reject(error)
})
export default service
