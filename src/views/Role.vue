<template>
  <div>
    <me-list-form :data="conditionForm" :onSearch="updateList" ref="listFormRef" />
    <el-card>
      <div slot="header">
        <el-button size="small" @click="handleAddRole">添加角色</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="添加时间">
          <template v-slot="{ row }">{{ row.createdTime | date }}</template>
        </el-table-column>
        <el-table-column label="操作" class-name="action-col" width="220">
          <template v-slot="{ row }">
            <el-link :underline="false" @click="$router.push(`/allocMenu?roleId=${row.id}`)">分配菜单</el-link>
            <el-link :underline="false" @click="$router.push(`/allocResource?roleId=${row.id}`)">分配资源</el-link>
            <el-link :underline="false" @click="handleEditRole(row)">编辑</el-link>
            <el-link :underline="false" @click="handleDeleteRole(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="name" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code" required>
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="描述" prop="description" required>
          <el-input type="textarea" v-model="formData.description" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getRolePages, deleteRole, saveOrUpdateRole,
  RoleType, RoleFormData
} from '@/services/role'
import { Form } from 'element-ui'
import { delRow, saveForm } from '@/utils/operation'

export default Vue.extend({
  name: 'Role',
  data () {
    return {
      conditionForm: [
        { label: '角色名称', field: 'name' }
      ],
      tableData: [] as RoleType[],
      loading: false,
      formVisible: false,
      formTitle: '',
      formData: {
        name: '',
        code: '',
        description: ''
      } as RoleFormData,
      rules: {
        name: { required: true, message: '请输入角色名称' },
        code: { required: true, message: '请输入角色编码' },
        description: { required: true, message: '请输入描述' }
      }
    }
  },
  mounted () {
    this.updateList()
  },
  methods: {
    async updateList () {
      const { formData } = this.$refs.listFormRef as any

      this.loading = true
      const data = await getRolePages(formData)
        .finally(() => (this.loading = false))

      this.tableData = data.records
    },
    handleAddRole () {
      this.formTitle = '添加角色'
      this.formData = {
        name: '',
        code: '',
        description: ''
      }
      this.formVisible = true
    },
    handleEditRole (row: RoleType) {
      this.formTitle = '编辑角色'
      this.formData = {
        id: row.id,
        name: row.name,
        code: row.code,
        description: row.description
      }
      this.formVisible = true
    },
    async handleSaveRole () {
      await saveForm({
        vueInstance: this,
        formRef: this.$refs.formRef as Form,
        saveRequest: () => saveOrUpdateRole(this.formData),
        listRequest: this.updateList,
        isEditMode: !!this.formData.id
      })
      this.formVisible = false
    },
    async handleDeleteRole (id: number) {
      delRow({
        vueInstance: this,
        delRequest: () => deleteRole(id),
        listRequest: this.updateList
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.condition-block {
  margin-bottom: 10px;
  &::v-deep .el-card__body {
    padding-bottom: 0;
  }
}
</style>
