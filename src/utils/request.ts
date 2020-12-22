import axios, { AxiosRequestConfig } from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import router from '@/router'

const axiosInstance = axios.create()

function redirectLogin () {
  router.push({
    path: '/Login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

async function refreshToken () {
  const { user } = store.state

  return await axios.create()({
    url: '/front/user/refresh_token',
    method: 'POST',
    data: qs.stringify({
      refreshtoken: user.refresh_token
    })
  })
}

axiosInstance.interceptors.request.use(
  // 请求成功
  config => {
    const { user } = store.state

    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }
    return config
  },
  // 请求失败
  error => {
    return Promise.reject(error)
  }
)

let refreshing = false
let requests: (() => void)[] = []
axiosInstance.interceptors.response.use(
  // 状态 2xx 进入这里
  ({ data }) => {
    // 响应成功
    if (data.success) {
      return data.content
    }
    Message.error(data.message)
    throw new Error(data.message)
  },
  // 状态超出 2xx 进入这里
  async error => {
    if (error.response) {
      // 请求收到响应，但状态不是 2xx
      const { status } = error.response

      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) {
        // 授权失败

        // 如果第一次登录或登录记录被清除
        if (!store.state.user) {
          redirectLogin()
          return Promise.reject(error)
        }

        // 多个请求同时出现 401 时，只有第一个进行刷新 token 操作，其他等待中，并将请求存起来
        if (refreshing) {
          return new Promise(resolve => {
            requests.push(() => {
              resolve(request(error.config))
            })
          })
        } else {
          refreshing = true
          try {
            const { data } = await refreshToken()

            // token 刷新失败进入 catch
            if (!data.success) {
              throw new Error('刷新 Token 失败')
            }

            // 将最新用户数据存进 vuex
            store.commit('setUser', data.content)

            // 执行存储的请求
            requests.forEach(cb => cb())

            // 执行完置空
            requests = []

            // 重新发起第一次触发 401 的请求
            return request(error.config)
          } catch (e) {
            store.commit('setUser', {})
            redirectLogin()
            return Promise.reject(error)
          } finally {
            refreshing = false
          }
        }
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
