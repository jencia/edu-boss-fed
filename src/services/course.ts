import request from '@/utils/request'

export interface CoursesCondition {
  currentPage?: number
  pageSize?: number
  courseName?: string
  status?: string
}

export interface ActivityCourseDTO {
  id: number
  courseId: number
  beginTime: string
  endTime: string
  amount: number
  stock: number
}
export interface TeacherDTO {
  id: number
  courseId: number
  teacherName: string
  teacherHeadPicUrl: string
  position: string
  description: string
}
export interface Course {
  teacherDTO: TeacherDTO[]
  courseName: string
  activityCourse: boolean
  activityCourseDTO: ActivityCourseDTO[]
  brief: string
  courseDescriptionMarkDown: string
  courseImgUrl: string
  courseListImg: string
  discounts: number
  discountsTag: string
  id: number
  previewFirstField: string
  previewSecondField: string
  price: number
  priceTag: string
  sales: number
  sortNum: number
  status: number
}

/** 根据Id获取广告信息 */
export function upload (data: FormData, onUploadProgress?: (e: any) => void) {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
  })
}

/** 查询课程列表 */
export function getQueryCourses (data: CoursesCondition): Promise<{ records: Course[], total: number }> {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

/** 新增或更新课程 */
export function saveOrUpdateCourse (data: CoursesCondition): Promise<Course[]> {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

/** 获取课程详情 */
export function getCourseById (courseId: number): Promise<Course> {
  return request({
    method: 'GET',
    url: '/front/course/getCourseById',
    params: { courseId }
  })
}

/** 获取课程详情 */
export function changeState (params: { courseId: number, status: number }): Promise<void> {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}
