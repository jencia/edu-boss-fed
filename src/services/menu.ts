import request from '@/utils/request'

export interface MenuType {
  id?: number
  parentId?: number
  name: string
  href: string
  icon?: string
  orderNum?: number
  description?: string
  shown?: boolean
}

/** 获取所有菜单数据 */
export function getAllMenu () {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

/** 创建或更新菜单 */
export function saveOrUpdateMenu (data: MenuType) {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

/** 删除菜单 */
export function deleteMenu (id: number) {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

/** 获取菜单 */
export function getMenu (id: number) {
  return request({
    method: 'GET',
    url: `/boss/menu/${id}`
  })
}

/** 获取编辑菜单页面信息 */
export function getEditMenuInfo (id: number) {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

/** 获取角色拥有的菜单列表 */
export function getRoleMenus (roleId: number) {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}

/** 给角色分配菜单 */
export function allocateRoleMenus (data: { roleId: number, menuIdList: number[] }) {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data: data
  })
}

/** 获取所有菜单并按层级展示 */
export function getMenuNodeList () {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}
