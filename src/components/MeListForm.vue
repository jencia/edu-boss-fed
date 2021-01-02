<template>
  <el-card class="condition-block">
    <el-form inline @submit.native.prevent>
      <el-form-item v-for="item in data" :key="item.field" :label="item.label">
        <el-input
          v-if="!item.options"
          v-model="formData[item.field]"
          size="small"
          :placeholder="item.placeholder || item.label"
          clearable
        />
        <el-select
          v-else
          v-model="formData[item.field]"
          size="small"
          :placeholder="item.placeholder || item.label"
          clearable
        >
          <el-option
            v-for="optItem in item.options"
            :key="optItem.value"
            :label="optItem.label"
            :value="optItem.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
        <el-button size="small" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'MeListForm',
  props: {
    data: {
      type: Array as PropType<{
        label: string,
        field: string,
        options?: { label: string, value: string }[],
        placeholder?: string
      }[]>,
      required: true
    },
    onSearch: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      formData: this.data.reduce((rs, item) => {
        rs[item.field] = ''
        return rs
      }, {} as Record<string, string>)
    }
  },
  methods: {
    handleReset () {
      this.formData = this.data.reduce((rs, item) => {
        rs[item.field] = ''
        return rs
      }, {} as Record<string, string>)
      this.onSearch(this.formData)
    },
    handleSearch () {
      this.onSearch(this.formData)
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
