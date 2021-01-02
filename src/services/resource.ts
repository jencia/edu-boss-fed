import request from '@/utils/request'

export interface ResourceType {
  name: string,
  categoryId: number,
  id: number,
  createdBy: string,
  url: string,
  description: string,
  updatedBy: string,
  createdTime: string,
  selected: boolean,
  updatedTime: string,
  operatorId: number
}
export interface CategoryType {
  name: string
  id: number
  sort: number
  createdBy: string
  selected: string
  updatedBy: string
  createdTime: string
  updatedTime: string
  operatorId: string
}
export interface ResourceQueryCondition {
  categoryId?: string
  id?: number
  name?: string
  url?: string
  startCreateTime?: string
  endCreateTime?: string
  current?: number
  size?: number
}
export interface CategoryFormData {
  id?: number,
  name: string,
  sort: number
}
export interface ResourceFormData {
  id?: number,
  name: string,
  categoryId: string,
  url: string,
  description: string
}

/** 给角色分配资源 */
export function allocateRoleResources (data: { roleId: number, resourceIdList: number[] }) {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data: data
  })
}

/** 查询资源分类列表 */
export function getAllCategory (resourceId?: number): Promise<CategoryType[]> {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll',
    params: {
      resourceId
    }
  })
}

/** 创建或更新资源分类 */
export function saveOrUpdateCategory (data: CategoryFormData) {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

/** 删除资源分类 */
export function deleteCategory (id: number) {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}

/** 获取所有资源 */
export function getAllResource (): Promise<ResourceType[]> {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

/** 按条件分页查询资源 */
export function getResourcePages (data: ResourceQueryCondition) {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

/** 获取角色拥有的资源列表 */
export function getRoleResources (roleId: number) {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: { roleId }
  })
}

/** 创建或更新资源分类 */
export function saveOrUpdateResource (data: ResourceFormData) {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

/** 获取资源 */
export function getResource (id: number) {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

/** 删除资源 */
export function deleteResource (id: number) {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
