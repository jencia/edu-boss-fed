<template>
  <el-card>
    <div slot="header">
      <el-button size="small" @click="$router.push('/addMenu')">添加菜单</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column width="60" prop="id" label="编号" />
      <el-table-column prop="name" label="菜单名称" />
      <el-table-column label="菜单级数">
        <template v-slot="{ row }">
          {{ ['一', '二', '三'][row.level] }}级
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="前端图标" />
      <el-table-column prop="orderNum" label="排序" />
      <el-table-column label="操作" class-name="action-col">
        <template v-slot="{ row }">
          <el-link
            :underline="false"
            @click="$router.push(`/updateMenu?id=${row.id}`)"
          >
            编辑
          </el-link>
          <el-link
            :underline="false"
            @click="handleDeleteMenu(row.id)"
          >
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenu, deleteMenu } from '@/services/menu'
import { delRow } from '@/utils/operation'

export default Vue.extend({
  name: 'Menu',
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  mounted () {
    this.updateMenu()
  },
  methods: {
    async updateMenu () {
      this.loading = true
      const data = await getAllMenu()
        .finally(() => (this.loading = false))

      this.tableData = data
    },
    async handleDeleteMenu (id: number) {
      delRow({
        vueInstance: this,
        delRequest: () => deleteMenu(id),
        listRequest: this.updateMenu
      })
    }
  }
})
</script>
