<template>
  <el-card>
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      default-expand-all
      :default-checked-keys="checkedKeys"
      node-key="id"
      :props="treePropsMap"
    />
    <div class="footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleClear">清空</el-button>
    </div>
  </el-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { getRoleMenus, allocateRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

interface MenuType {
  id: number
  name: string
  selected: boolean
  subMenuList: MenuType[]
}

export default Vue.extend({
  name: 'AllocMenu',
  data () {
    return {
      roleId: +this.$route.query.roleId,
      data: [] as MenuType[],
      treePropsMap: {
        label: 'name',
        children: 'subMenuList',
        checked: 'selected'
      },
      checkedKeys: [] as number[]
    }
  },
  created () {
    if (!this.roleId) {
      this.$router.replace('/Role')
    } else {
      this.initData()
    }
  },
  methods: {
    async initData () {
      const data = await getRoleMenus(this.roleId) as MenuType[]
      const checkedKeys = this.getCheckedKeys(data)

      this.data = data
      this.checkedKeys = checkedKeys
    },
    getCheckedKeys (data: MenuType[]) {
      let keys: number[] = []

      for (const item of data) {
        if (item.subMenuList?.length) {
          keys = keys.concat(this.getCheckedKeys(item.subMenuList))
        } else if (item.selected) {
          keys.push(item.id)
        }
      }
      return keys
    },
    async handleSave () {
      const checkedKeys = (this.$refs.tree as Tree).getCheckedKeys()
      let loading

      try {
        const rs = await this.$confirm('是否分配菜单？', '提示')

        if (rs !== 'confirm') {
          return
        }

        loading = this.$loading({ text: '保存中...' })

        await allocateRoleMenus({
          roleId: this.roleId,
          menuIdList: checkedKeys
        })

        this.$message.success('菜单分配成功')
        this.$router.back()
      } catch (e) {
      } finally {
        loading && loading.close()
      }
    },
    handleClear () {
      (this.$refs.tree as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 20px;
  text-align: center;
}
</style>
