import axios, { AxiosRequestConfig } from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

const axiosInstance = axios.create({
  baseURL: 'http://eduboss.lagou.com'
})

axiosInstance.interceptors.request.use(
  config => {
    const { user } = store.state

    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
axiosInstance.interceptors.response.use(
  ({ data }) => { // 状态 2xx 进入这里
    // 响应成功
    if (data.success) {
      return data.content
    }
    Message.error(data.message)
    throw new Error(data.message)
  },
  error => { // 状态超出 2xx 进入这里
    if (error.response) {
      // 请求收到响应，但状态不是 2xx
      const { status } = error.response

      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) {
        // 授权失败
        console.error('无权访问')
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
        Message.error('请求资源不存在')
      } else if (status >= 500) {
        Message.error('服务器错误，请联系管理员')
      }
    } else if (error.request) {
      // 请求发出，但没收到响应
      Message.error('请求超时，请刷新重试')
    } else {
      // 其他异常
      Message.error(`请求失败：${error.message}`)
    }
    return Promise.reject(error)
  }
)

function request <T = any> (config: AxiosRequestConfig): Promise<T> {
  // @ts-ignore
  return axiosInstance(config)
}

export default request
