<template>
  <el-card>
    <el-form v-model="formData" label-width="80px">
      <el-form-item label="课程" required>
        <el-input v-model="formData.courseName" disabled />
      </el-form-item>
      <el-form-item label="课时" required>
        <el-input v-model="formData.lessonName" disabled />
      </el-form-item>
      <el-form-item label="视频上传">
        <el-upload action>
          <el-button type="primary">选择视频</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="视频上传">
        <image-upload v-model="formData.img" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">开始上传</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { getCourseById, getLessonById } from '@/services/course'
import Vue from 'vue'
import ImageUpload from '@/components/ImageUpload.vue'

export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      id: +this.$route.params?.id,
      formData: {
        courseName: '',
        lessonName: '',
        img: ''
      }
    }
  },
  components: { ImageUpload },
  created () {
    if (!this.id) {
      this.$router.replace('/Courses')
    }
  },
  async mounted () {
    const lesson = await getLessonById(this.id)
    const course = await getCourseById(lesson.courseId)

    this.formData.courseName = course.courseName
    this.formData.lessonName = lesson.theme
  }
})
</script>
