import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: '',
  timeout: 10000
})

// 请求拦截
service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Toast.fail(res.message || '请求失败')
      if (res.code === 401) {
        store.dispatch('user/logout')
        router.push('/login')
      }
      return Promise.reject(new Error(res.message))
    }
    return res
  },
  error => {
    console.error('[Response Error]', error)
    Toast.fail('网络异常，请稍后重试')
    return Promise.reject(error)
  }
)

export default service
