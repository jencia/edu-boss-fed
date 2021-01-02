<template>
  <el-card>
    <ul class="category-list">
      <li v-for="category in categoryList" :key="category.id">
        <div class="category">
          <el-checkbox
            v-model="category.selected"
            :indeterminate="category.indeterminate"
            @change="handleCategorySelect($event, category)"
          >
            {{ category.name }}
          </el-checkbox>
        </div>
        <div class="resource-list">
          <el-row>
            <el-col
              v-for="resource in category.resourceList"
              :key="resource.id"
              :span="8"
            >
              <el-checkbox
                v-model="resource.selected"
                @change="handleResourceSelect(category)"
              >
                {{ resource.name }}
              </el-checkbox>
            </el-col>
          </el-row>
        </div>
      </li>
    </ul>
    <div class="footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleClear">清空</el-button>
    </div>
  </el-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { getRoleResources, allocateRoleResources } from '@/services/resource'

interface CategoryType {
  id: number
  name: string
  selected: boolean
  indeterminate: boolean
  resourceList: {
    id: number,
    name: string,
    selected: boolean
  }[]
}

export default Vue.extend({
  name: 'AllocResource',
  data () {
    return {
      roleId: +this.$route.query.roleId,
      categoryList: [] as CategoryType[]
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
      const categoryList = await getRoleResources(this.roleId) as CategoryType[]

      this.categoryList = categoryList
        .sort((a, b) => a.id - b.id)
        .map(category => {
          if (!category.resourceList) {
            category.resourceList = []
          }
          const len = category.resourceList.length
          const selectedNum = category.resourceList.filter(v => v.selected).length

          category.indeterminate = selectedNum > 0 && selectedNum < len
          return category
        })
    },
    getCheckedKeys () {
      const checkedkeys: number[] = []

      for (const category of this.categoryList) {
        for (const resource of category.resourceList) {
          resource.selected && checkedkeys.push(resource.id)
        }
      }
      return checkedkeys
    },
    handleCategorySelect (checked: boolean, category: CategoryType) {
      category.indeterminate = false
      category.resourceList.forEach(resource => {
        resource.selected = checked
      })
    },
    handleResourceSelect (category: CategoryType) {
      const len = category.resourceList.length
      const selectedNum = category.resourceList.filter(v => v.selected).length

      category.indeterminate = selectedNum > 0 && selectedNum < len
      category.selected = selectedNum === len
    },
    async handleSave () {
      const checkedKeys = this.getCheckedKeys()
      let loading

      try {
        const rs = await this.$confirm('是否分配资源？', '提示')

        if (rs !== 'confirm') {
          return
        }

        loading = this.$loading({ text: '保存中...' })

        await allocateRoleResources({
          roleId: this.roleId,
          resourceIdList: checkedKeys
        })

        this.$message.success('资源分配成功')
        this.$router.back()
      } catch (e) {
      } finally {
        loading && loading.close()
      }
    },
    handleClear () {
      for (const category of this.categoryList) {
        category.selected = false
        category.indeterminate = false
        for (const resource of category.resourceList) {
          resource.selected = false
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
$color-line: #dcdfe6;

.category-list {
  padding: 0;
  border: 1px solid $color-line;
  margin: 0;
  list-style: none;

  .category {
    padding: 20px;
    border-top: 1px solid $color-line;
    border-bottom: 1px solid $color-line;
    background: #f2f6fc;
  }
  .resource-list {
    padding: 20px;
    .el-col {
      padding: 4px 0;
    }
  }
  li:first-child .category {
    border-top: none;
  }
}
.footer {
  margin-top: 20px;
  text-align: center;
}
</style>
