import request from '@/utils/request'

export interface RoleType {
  code: string
  id: number
  name: string
  createdBy: string
  description: string
  updatedBy: string
  createdTime: string
  updatedTime: string
  operatorId: number
}
export interface RoleQueryCondition {
  code?: string
  id?: number
  name?: string
  startCreateTime?: string
  endCreateTime?: string
  current?: number
  size?: number
}
export interface RoleFormData {
  id?: number,
  name: string,
  code: string,
  description: string
}

/** 获取所有角色数据 */
export function getAllRole (): Promise<RoleType[]> {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

/** 给用户分配角色 */
export function allocateUserRoles (data: { userId: number, roleIdList: number[] }) {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

/** 按条件查询角色数据 */
export function getRolePages (data?: RoleQueryCondition) {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}

/** 列出所有角色，并且标记当前用户ID是否拥有该角色 */
export function getRolesWithUserPermission (userId: number) {
  return request({
    method: 'GET',
    url: '/boss/role/getRolesWithUserPermission',
    params: { userId }
  })
}

/** 创建或更新菜单 */
export function saveOrUpdateRole (data: RoleFormData) {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

/** 删除菜单 */
export function deleteRole (id: number) {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

/** 获取菜单 */
export function getRole (id: number) {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

/** 查询用户角色 */
export function getUserRole (id: number) {
  return request({
    method: 'GET',
    url: `/boss/role/user/${id}`
  })
}
