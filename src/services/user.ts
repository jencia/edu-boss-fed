import request from '@/utils/request'
import qs from 'qs'
export interface UserInfoType {
  isUpdatedPassword?: boolean
  portrait?: null | string
  userName?: string
}
export interface UserType {
  id: number,
  name: string
  portrait: string
  phone: string
  password: string
  accountNonExpired: boolean
  credentialsNonExpired: boolean
  accountNonLocked: boolean
  status: string
  isDel: boolean,
  createTime: string
  updateTime: string
}
export interface UserQueryCondition {
  currentPage?: number,
  pageSize?: number,
  phone?: string,
  userId?: number,
  startCreateTime?: string,
  endCreateTime?: string
}

/** 登录 */
export function login (data: { phone: string, password: string }) {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

/** 登出 */
export function logout () {
  return request({
    method: 'POST',
    url: '/front/user/logout'
  })
}

/** 获取用户基本信息 */
export function getInfo (): Promise<UserInfoType> {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

/** 分页查询用户信息 */
export function getUserPages (data: UserQueryCondition) {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

/** 封禁用户 */
export function forbidUser (userId: number) {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    data: { userId }
  })
}

/** 启用用户 */
export function enableUser (userId: number) {
  return request({
    method: 'GET',
    url: '/boss/user/enableUser',
    params: { userId }
  })
}
