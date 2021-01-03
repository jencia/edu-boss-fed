<template>
  <el-card>
    <div slot="header">
      {{ id ? '编辑广告' : '添加广告'}}
    </div>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="广告名称" prop="name" required>
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="广告位置">
        <el-select v-model="formData.spaceId">
          <el-option
            v-for="space in spaceList"
            :key="space.id"
            :label="space.name"
            :value="space.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime" required>
        <el-date-picker type="datetime" v-model="formData.startTime" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="到期时间" prop="endTime" required>
        <el-date-picker type="datetime" v-model="formData.endTime" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="上线/下线">
        <el-radio-group v-model="formData.status">
          <el-radio :label="0">下线</el-radio>
          <el-radio :label="1">上线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告图片">
        <!-- <el-input v-model="formData.orderNum"></el-input> -->
      </el-form-item>
      <el-form-item label="广告链接" prop="link" required>
        <el-input v-model="formData.link" />
      </el-form-item>
      <el-form-item label="广告备注">
        <el-input type="textarea" v-model="formData.text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button v-if="!id" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { getAllSpaces, AdFormData, getAdById, saveOrUpdateAd } from '@/services/ad'
import { Form } from 'element-ui'
import { saveForm } from '@/utils/operation'

const defaultData: AdFormData = {
  id: undefined,
  name: '',
  spaceId: undefined,
  startTime: '',
  endTime: '',
  status: 0,
  link: '',
  text: ''
}

export default Vue.extend({
  name: 'AdvertiseEdit',
  props: {
    id: Number
  },
  data () {
    return {
      formData: { ...defaultData },
      rules: {
        name: { required: true, message: '请输入广告名称' },
        startTime: { required: true, message: '请选择开始时间' },
        endTime: { required: true, message: '请选择到期时间' },
        link: { required: true, message: '请选择输入广告链接' }
      },
      spaceList: [] as {
        id: number,
        name: string,
        [key: string]: any
      }[]
    }
  },
  mounted () {
    this.initData()
    this.initSpaceList()
  },
  methods: {
    async initData () {
      if (!this.id) {
        return
      }
      const data = await getAdById(this.id)

      this.formData = data
    },
    async initSpaceList () {
      const data = await getAllSpaces()

      this.spaceList = data
    },
    async handleSubmit () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.formRef as Form,
        saveRequest: () => saveOrUpdateAd(this.formData),
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
