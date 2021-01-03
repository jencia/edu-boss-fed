import request from '@/utils/request'

export interface AdType {
  id: number
  name: string
  spaceId: number
  spaceName?: string
  keyword: string
  htmlContent: string
  text: string
  img: string
  link: string
  startTime: string
  endTime: string
  createTime: string
  updateTime: string
  status: number
  priority: number
  startTimeFormatString: string
  endTimeFormatString: string
}
export interface SpaceType {
  id: number
  name: string
  spaceKey: string
  createTime: string
  updateTime: string
  isDel: number
  adDTOList: AdType[] | null
}
export interface AdFormData {
  id?: number
  name: string
  spaceId?: number
  keyword?: string
  htmlContent?: string
  text?: string
  img?: string
  link: string
  startTime: string
  endTime: string
  createTime?: string
  updateTime?: string
  status?: number
  priority?: number
  startTimeFormatString?: string
  endTimeFormatString?: string
}
export interface SpaceFormData {
  id?: number
  name: string
}

/** 根据Id获取广告信息 */
export function getAdById (id: number) {
  return request({
    method: 'GET',
    url: '/front/ad/getAdById',
    params: { id }
  })
}

/** 获取所有的广告列表 */
export function getAdList (): Promise<AdType[]> {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList'
  })
}

/** 获取所有的广告位及其对应的广告 */
export function getAllAds (spaceKeys: string[]) {
  return request({
    method: 'GET',
    url: '/front/ad/getAllAds',
    params: { spaceKeys }
  })
}

/** 新增或者修改广告信息 */
export function saveOrUpdateAd (data: AdFormData) {
  return request({
    method: 'POST',
    url: '/front/ad/saveOrUpdate',
    data
  })
}

/** 获取所有的广告位 */
export function getAllSpaces (): Promise<SpaceType[]> {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

/** 根据Id获取广告位 */
export function getSpaceById (id: number) {
  return request({
    method: 'GET',
    url: '/front/ad/space/getSpaceById',
    params: { id }
  })
}

/** 新增或者修改广告位 */
export function saveOrUpdateSpace (data: SpaceFormData) {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}

/** 更新广告的状态 */
export function updateAdStatus (params: { id: number, status: 0 | 1}) {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params
  })
}
