import request from '@/utils/request'
import qs from 'qs'

// 用户接口调用的 host 跟其他接口都不一样，在这单独设置
// const HOST = 'http://edufront.lagou.com'

// 登录
export function login (data: { phone: string, password: string }) {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

// 登出
export function logout () {
  return request({
    method: 'POST',
    url: '/front/user/logout'
  })
}

export interface UserInfoType {
  isUpdatedPassword?: boolean
  portrait?: null | string
  userName?: string
}

// 获取用户基本信息
export function getInfo (): Promise<UserInfoType> {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
