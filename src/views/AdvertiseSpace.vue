<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button size="small" @click="handleAdd">添加广告位</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="140" prop="spaceKey" label="spaceKey" />
        <el-table-column prop="name" label="广告位名称" />
        <el-table-column label="创建时间">
          <template v-slot="{ row }">{{ row.createTime | date }}</template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template v-slot="{ row }">{{ row.updateTime | date }}</template>
        </el-table-column>
        <el-table-column width="100" label="操作" class-name="action-col">
          <template v-slot="{ row }">
            <el-link :underline="false" @click="handleEdit(row)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="formData.name" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAllSpaces, saveOrUpdateSpace,
  SpaceType, SpaceFormData
} from '@/services/ad'
import { Form } from 'element-ui'
import { saveForm } from '@/utils/operation'

const defaultFormData = { name: '' } as SpaceFormData

export default Vue.extend({
  name: 'AdvertiseSpace',
  data () {
    return {
      tableData: [] as SpaceType[],
      loading: false,
      formVisible: false,
      formTitle: '',
      formData: { ...defaultFormData },
      rules: {
        name: { required: true, message: '请输入名称' }
      }
    }
  },
  mounted () {
    this.updateList()
  },
  methods: {
    async updateList () {
      this.loading = true
      const data = await getAllSpaces()
        .finally(() => (this.loading = false))

      this.tableData = data
    },
    handleAdd () {
      this.formTitle = '添加广告位'
      this.formData = { ...defaultFormData }
      this.formVisible = true

      this.$nextTick(() => {
        (this.$refs.formRef as Form).clearValidate()
      })
    },
    handleEdit (row: SpaceType) {
      this.formTitle = '编辑广告位'
      this.formData = {
        id: row.id,
        name: row.name
      }
      this.formVisible = true
    },
    async handleSave () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.formRef as Form,
        saveRequest: () => saveOrUpdateSpace(this.formData),
        listRequest: this.updateList,
        isEditMode: !!this.formData.id
      })
      this.formVisible = false
    }
  }
})
</script>
