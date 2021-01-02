<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button size="small" @click="handleAdd">添加分类</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column label="添加时间">
          <template v-slot="{ row }">{{ row.createdTime | date }}</template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" />
        <el-table-column label="操作" class-name="action-col">
          <template v-slot="{ row }">
            <el-link :underline="false" @click="handleEdit(row)">编辑</el-link>
            <el-link :underline="false" @click="handleDelete(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" required>
          <el-input type="number" v-model="formData.sort" />
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
  getAllCategory, deleteCategory, saveOrUpdateCategory,
  CategoryType, CategoryFormData
} from '@/services/resource'
import { Form } from 'element-ui'
import { delRow, saveForm } from '@/utils/operation'

const defaultFormData = {
  name: '',
  sort: 0
} as CategoryFormData

export default Vue.extend({
  name: 'Resource',
  data () {
    return {
      tableData: [] as CategoryType[],
      loading: false,
      formVisible: false,
      formTitle: '',
      formData: { ...defaultFormData },
      rules: {
        name: { required: true, message: '请输入名称' },
        sort: { required: true, message: '请输入排序' }
      }
    }
  },
  mounted () {
    this.updateList()
  },
  methods: {
    async updateList () {
      this.loading = true
      const data = await getAllCategory()
        .finally(() => (this.loading = false))

      this.tableData = data
    },
    handleAdd () {
      this.formTitle = '添加分类'
      this.formData = { ...defaultFormData }
      this.formVisible = true

      this.$nextTick(() => {
        (this.$refs.formRef as Form).clearValidate()
      })
    },
    handleEdit (row: CategoryType) {
      this.formTitle = '编辑资源'
      this.formData = {
        id: row.id,
        name: row.name,
        sort: row.sort
      }
      this.formVisible = true
    },
    async handleSave () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.formRef as Form,
        saveRequest: () => saveOrUpdateCategory(this.formData),
        listRequest: this.updateList,
        isEditMode: !!this.formData.id
      })
      this.formVisible = false
    },
    async handleDelete (id: number) {
      delRow({
        vueInstance: this,
        delRequest: () => deleteCategory(id),
        listRequest: this.updateList
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 20px;

  &::v-deep .el-pager li.active {
    color: #fff;
    background: #40586F;
    cursor: default;
    margin: 0 4px;
    min-width: 30px;
  }
}
</style>
