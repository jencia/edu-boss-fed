import request from '@/utils/request'

export interface CoursesCondition {
  currentPage?: number
  pageSize?: number
  courseName?: string
  status?: string
}

export interface ActivityCourseDTO {
  id?: number
  courseId?: number
  beginTime?: string
  endTime?: string
  amount?: number
  stock?: number
}
export interface TeacherDTO {
  id?: number
  courseId?: number
  teacherName: string
  teacherHeadPicUrl?: string
  position: string
  description: string
}

export interface CourseFormData {
  teacherDTO: TeacherDTO
  courseName: string
  activityCourse: boolean
  activityCourseDTO: ActivityCourseDTO | null
  brief: string
  courseDescriptionMarkDown: string
  courseImgUrl: string
  courseListImg: string
  discounts: number
  discountsTag: string
  id?: number
  previewFirstField: string
  previewSecondField: string
  price: number
  priceTag?: string
  sales: number
  sortNum: number
  status?: number
}
export interface Course extends CourseFormData {
  id: number
  priceTag: string
  status: number
  courseDescription: string
}

export interface Lesson {
  courseId: number
  createTime: string
  duration: string
  durationNum: number
  id: number
  isDel: boolean
  isFree: boolean
  orderNum: number
  sectionId: number
  status: number
  theme: string
  updateTime: string
}
export interface Section {
  courseId: number
  createTime: string
  description: string
  id: number
  isDe: boolean
  lessonDTOS: Lesson[]
  orderNum: number
  sectionName: string
  status: number
  updateTime: string
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
export function saveOrUpdateCourse (data: CourseFormData): Promise<void> {
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
    url: '/boss/course/getCourseById',
    params: { courseId }
  })
}

/** 改变课程上架状态 */
export function changeState (params: { courseId: number, status: number }): Promise<void> {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

/** 获取阶段和课时数据 */
export function getSectionAndLesson (courseId: number): Promise<Section[]> {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: { courseId }
  })
}

/** 更新阶段信息 */
export function saveOrUpdateSection (data: any): Promise<void> {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

/** 更新课时信息 */
export function saveOrUpdateLesson (data: any): Promise<void> {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

/** 根据ID获取课时信息 */
export function getLessonById (lessonId: number): Promise<Lesson> {
  return request({
    method: 'GET',
    url: '/boss/course/lesson/getById',
    params: { lessonId }
  })
}
