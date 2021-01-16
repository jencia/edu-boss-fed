import request from '@/utils/request'

/** 根据Id获取广告信息 */
export function upload (data: FormData, onUploadProgress?: (e: any) => void) {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })
}
