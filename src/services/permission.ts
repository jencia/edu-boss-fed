import request from '@/utils/request'

export interface MenuItem {
    parentId: number,
    selected: boolean,
    id: number,
    name: string,
    subMenuList: MenuItem[],
    createdBy: string,
    href: string,
    icon: string,
    updatedBy: string,
    createdTime: string,
    orderNum: number,
    description: string,
    updatedTime: string,
    shown: boolean,
    level: number,
}

export interface UserPermissionsData {
  menuList: MenuItem[]
  resourceList: {
    name: string,
    categoryId: number,
    id: number,
    createdBy: string,
    url: string,
    description: string,
    updatedBy: string,
    createdTime: string,
    selected: boolean,
    updatedTime: string
  }[]
}

// 获取用户权限数据
export function getUserPermissions (): Promise<UserPermissionsData> {
  return request({
    method: 'GET',
    url: '/boss/permission/getUserPermissions'
  })
}
