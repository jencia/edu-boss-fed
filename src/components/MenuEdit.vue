<template>
  <el-card>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="菜单名称" prop="name" required>
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径">
        <el-input v-model="formData.href"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-select v-model="formData.parentId">
          <el-option
            v-for="menu in parentMenuList"
            :key="menu.id"
            :label="menu.name"
            :value="menu.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description" required>
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="前端图标" prop="icon" required>
        <el-input v-model="formData.icon"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="formData.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="number" v-model="formData.orderNum"></el-input>
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
import { getMenu, MenuType, getEditMenuInfo, saveOrUpdateMenu } from '@/services/menu'
import { Form } from 'element-ui'

const defaultData: MenuType = {
  id: undefined,
  parentId: -1,
  name: '',
  href: '',
  icon: '',
  orderNum: 0,
  description: '',
  shown: false
}

export default Vue.extend({
  name: 'MenuEdit',
  props: {
    id: Number
  },
  data () {
    return {
      formData: { ...defaultData },
      rules: {
        name: { required: true, message: '请输入菜单名称' },
        description: { required: true, message: '请输入描述' },
        icon: { required: true, message: '请输入前端图标' }
      },
      parentMenuList: [] as {
        id: number,
        name: string,
        [key: string]: any
      }[]
    }
  },
  mounted () {
    this.initData()
    this.initParentMenuList()
  },
  methods: {
    async initData () {
      if (!this.id) {
        return
      }
      const data = await getMenu(this.id)

      this.formData = data
    },
    async initParentMenuList () {
      const { parentMenuList } = await getEditMenuInfo(this.id || -1)

      this.parentMenuList = [
        { id: -1, name: '无上级菜单' },
        ...parentMenuList
      ]
    },
    async handleSubmit () {
      const validRes = await (this.$refs.formRef as Form)
        .validate()
        .catch(e => e)

      if (!validRes) {
        this.$message.error('验证失败')
        return
      }

      let loading
      try {
        const rs = await this.$confirm('是否提交数据', '提示')

        if (rs !== 'confirm') {
          return
        }

        loading = this.$loading({ text: '提交中...' })
        await saveOrUpdateMenu(this.formData)

        this.$message.success(this.id ? '修改成功' : '添加成功')
        this.$router.go(-1)
      } catch (e) {
      } finally {
        loading && loading.close()
      }
    },
    handleReset () {
      this.formData = { ...defaultData }
    }
  }
})
</script>
