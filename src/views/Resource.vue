<template>
  <div>
    <me-list-form :data="conditionForm" :onSearch="handleSearch" ref="listFormRef" />
    <el-card>
      <div slot="header">
        <el-button size="small" @click="handleAdd">添加资源</el-button>
        <el-button size="small" @click="$router.push('/resourceCategory')">资源分类管理</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column prop="name" label="资源名称" />
        <el-table-column prop="url" label="资源路径" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="添加时间">
          <template v-slot="{ row }">{{ row.createdTime | date }}</template>
        </el-table-column>
        <el-table-column label="操作" class-name="action-col">
          <template v-slot="{ row }">
            <el-link :underline="false" @click="handleEdit(row)">编辑</el-link>
            <el-link :underline="false" @click="handleDelete(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 15, 20]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal"
      />
    </el-card>
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="资源名称" prop="name" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="资源路径" prop="url" required>
          <el-input v-model="formData.url" />
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId" required>
          <el-select v-model="formData.categoryId">
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input type="textarea" v-model="formData.description" />
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
  getResourcePages, deleteResource, saveOrUpdateResource,
  ResourceType, ResourceFormData, getAllCategory
} from '@/services/resource'
import { Form } from 'element-ui'
import { delRow, saveForm } from '@/utils/operation'

const defaultFormData = {
  categoryId: '',
  url: '',
  name: '',
  description: ''
} as ResourceFormData

export default Vue.extend({
  name: 'Resource',
  data () {
    return {
      categoryList: [] as { label: string, value: string }[],
      conditionForm: [] as {
        label: string,
        field: string,
        options?: { label: string, value: string }[],
        placeholder?: string
      }[],
      tableData: [] as ResourceType[],
      dataTotal: 0,
      loading: false,
      formVisible: false,
      formTitle: '',
      formData: { ...defaultFormData },
      rules: {
        name: { required: true, message: '请输入角色名称' },
        url: { required: true, message: '请输入资源路径' },
        categoryId: { required: true, message: '请选择资源分类' },
        description: { required: true, message: '请输入描述' }
      },
      page: {
        current: 1,
        size: 10
      }
    }
  },
  mounted () {
    this.initCategoryList()
    this.updateList()
  },
  methods: {
    async initCategoryList () {
      const data = await getAllCategory()

      this.categoryList = data.map(v => ({
        label: v.name,
        value: String(v.id)
      }))
      this.conditionForm = [
        { label: '资源名称', field: 'name' },
        { label: '资源路径', field: 'url' },
        {
          label: '资源分类',
          field: 'categoryId',
          options: this.categoryList,
          placeholder: '全部'
        }
      ]
    },
    async updateList () {
      const { formData } = this.$refs.listFormRef as any

      this.loading = true
      const data = await getResourcePages({
        ...formData,
        ...this.page
      })
        .finally(() => (this.loading = false))

      this.tableData = data.records
      this.dataTotal = data.total
    },
    handleAdd () {
      this.formTitle = '添加资源'
      this.formData = { ...defaultFormData }
      this.formVisible = true

      this.$nextTick(() => {
        (this.$refs.formRef as Form).clearValidate()
      })
    },
    handleEdit (row: ResourceType) {
      this.formTitle = '编辑资源'
      this.formData = {
        id: row.id,
        categoryId: String(row.categoryId),
        url: row.url,
        name: row.name,
        description: row.description
      }
      this.formVisible = true
    },
    async handleSave () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.formRef as Form,
        saveRequest: () => saveOrUpdateResource(this.formData),
        listRequest: this.updateList,
        isEditMode: !!this.formData.id
      })
      this.formVisible = false
    },
    async handleDelete (id: number) {
      delRow({
        vueInstance: this,
        delRequest: () => deleteResource(id),
        listRequest: this.updateList
      })
    },
    handleSizeChange (size: number) {
      this.page.size = size
      this.page.current = 1
      this.updateList()
    },
    handleCurrentChange (current: number) {
      this.page.current = current
      this.updateList()
    },
    handleSearch () {
      this.page.size = 10
      this.page.current = 1
      this.updateList()
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
