<template>
  <div class="course-edit">
    <el-card>
      <div slot="header">
        {{ id ? '编辑课程' : '新增课程'}}
      </div>
    </el-card>
    <el-card>
      <div slot="header">基本信息</div>
      <el-form ref="formRef1" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="courseName" required>
          <el-input v-model="formData.courseName" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="简介" prop="brief" required>
          <el-input v-model="formData.brief" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="讲师姓名" prop="teacherDTO.teacherName" required>
          <el-input v-model="formData.teacherDTO.teacherName" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="职位" prop="teacherDTO.position" required>
          <el-input v-model="formData.teacherDTO.position" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="讲师简介" prop="teacherDTO.description" required>
          <el-input v-model="formData.teacherDTO.description" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="课程概述" prop="previewFirstField" required>
          <el-row type="flex">
            <el-input v-model="formData.previewFirstField" maxlength="20" show-word-limit />
            <div style="width: 12px" />
            <el-input v-model="formData.previewSecondField" maxlength="20" show-word-limit />
          </el-row>
        </el-form-item>
        <el-form-item label="课程封面">
          <image-upload v-model="formData.courseImgUrl" />
        </el-form-item>
        <el-form-item label="解锁封面">
          <image-upload v-model="formData.courseListImg" width="750" height="422" />
        </el-form-item>
        <el-form-item label="课程排序" prop="sortNum" required>
          <el-input type="number" v-model="formData.sortNum">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">销售信息</div>
      <el-form ref="formRef2" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="售卖价格" prop="discounts" required>
          <el-input type="number" v-model="formData.discounts">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input type="number" v-model="formData.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input type="number" v-model="formData.sales">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签">
          <el-input v-model="formData.discountsTag" maxlength="4" show-word-limit />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">秒杀活动</div>
      <el-form :model="formData" label-width="120px">
        <el-form-item label="限时秒杀开关">
          <el-switch v-model="formData.activityCourse" />
        </el-form-item>
        <template v-if="formData.activityCourse">
          <el-form-item label="开始时间">
            <el-date-picker v-model="formData.activityCourseDTO.beginTime" />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="formData.activityCourseDTO.endTime" />
          </el-form-item>
          <el-form-item label="秒杀价">
            <el-input type="number" v-model="formData.activityCourseDTO.amount">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存">
            <el-input type="number" v-model="formData.activityCourseDTO.stock">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">课程详情</div>
      <rich-editor v-model="formData.courseDescriptionMarkDown" />
    </el-card>
    <el-card>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button v-if="!id" @click="handleReset">重置</el-button>
      </el-row>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getCourseById, saveOrUpdateCourse, CourseFormData } from '@/services/course'
import { Form } from 'element-ui'
import { saveForm } from '@/utils/operation'
import ImageUpload from '@/components/ImageUpload.vue'
import RichEditor from '@/components/RichEditor.vue'

const defaultData: CourseFormData = {
  id: undefined,
  courseName: '',
  brief: '',
  teacherDTO: {
    teacherName: '',
    position: '',
    description: ''
  },
  previewFirstField: '',
  previewSecondField: '',
  courseImgUrl: '',
  courseListImg: '',
  sortNum: 0,

  discounts: 0,
  price: 0,
  sales: 0,
  discountsTag: '',

  activityCourse: false,
  activityCourseDTO: {
    beginTime: '',
    endTime: '',
    amount: 0,
    stock: 0
  },

  courseDescriptionMarkDown: ''
}

export default Vue.extend({
  name: 'CourseEdit',
  props: {
    id: Number
  },
  components: { ImageUpload, RichEditor },
  data () {
    return {
      formData: { ...defaultData },
      rules: {
        courseName: { required: true, message: '请输入名称' },
        brief: { required: true, message: '请输入简介' },
        teacherDTO: {
          teacherName: { required: true, message: '请输入讲师名称' },
          position: { required: true, message: '请输入职位' },
          description: { required: true, message: '请输入讲师简介' }
        },
        previewFirstField: { required: true, message: '请输入课程概况' },
        sortNum: { required: true, message: '请输入课程排序' },
        discounts: { required: true, message: '请输入售卖价格' }
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      if (!this.id) {
        return
      }
      const data = await getCourseById(this.id)

      if (!data.activityCourse) {
        data.activityCourseDTO = {
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        }
      }
      this.formData = data
    },
    async handleSubmit () {
      await saveForm({
        vueInstance: this,
        formRef: [
          this.$refs.formRef1,
          this.$refs.formRef2
        ] as Form[],
        saveRequest: () => saveOrUpdateCourse(this.formData)
          .catch(e => {
            this.$message.error('系统异常')
            throw e
          }),
        isEditMode: !!this.formData.id
      })
      this.$router.go(-1)
    },
    handleReset () {
      this.formData = { ...defaultData }
    }
  }
})
</script>

<style lang="scss" scoped>
.course-edit::v-deep {
  .el-card {
    margin-bottom: 12px;
  }
  .el-card__body:empty {
    display: none;
  }
}
</style>
