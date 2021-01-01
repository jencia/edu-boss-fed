import request from '@/utils/request'

/** 获取所有菜单数据 */
export function getAllMenu () {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

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
