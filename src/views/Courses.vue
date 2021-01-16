<template>
  <div>
    <me-list-form :data="conditionForm" :onSearch="updateList" ref="listFormRef" />
    <el-card>
      <div slot="header">
        <el-button
          size="small"
          type="primary"
          @click="$router.push('/courses/new')"
        >
          新建课程
        </el-button>
      </div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="60" prop="id" label="ID" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column label="价格">
          <template v-slot="{ row }">￥{{ row.price }}</template>
        </el-table-column>
        <el-table-column prop="sortNum" label="排序" />
        <el-table-column label="状态" align="center">
          <template v-slot="{ row }">
            <i class="status" :class="row.status === 1 ? 'status-success' : 'status-danger'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="action-col" width="240">
          <template v-slot="{ row }">
            <el-button
              size="mini"
              :type="row.status === 1 ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '下' : '上' }}架
            </el-button>
            <el-button size="mini" @click="$router.push(`/courses/${row.id}`)">编辑</el-button>
            <el-button size="mini" @click="$router.push(`/courses/${row.id}/sections`)">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getQueryCourses, Course, CoursesCondition, changeState
} from '@/services/course'

const statusOptions = [
  { label: '全部', value: '' },
  { label: '上架', value: '1' },
  { label: '下架', value: '0' }
]

export default Vue.extend({
  name: 'Role',
  data () {
    return {
      conditionForm: [
        { label: '课程名称', field: 'courseName' },
        { label: '状态', field: 'status', type: 'select', options: statusOptions }
      ],
      tableData: [] as Course[],
      loading: false,
      formVisible: false,
      formTitle: '',
      formData: {
        name: '',
        status: ''
      } as CoursesCondition,
      currentPage: 1,
      pageSize: 10,
      totalNum: 0
    }
  },
  mounted () {
    this.updateList()
  },
  methods: {
    async updateList () {
      const { formData } = this.$refs.listFormRef as any

      this.loading = true
      const data = await getQueryCourses({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...formData
      })
        .finally(() => (this.loading = false))

      this.tableData = data.records
      this.totalNum = data.total
    },
    handleSizeChange (size: number) {
      this.pageSize = size
      this.currentPage = 1
      this.updateList()
    },
    handleCurrentChange (current: number) {
      this.currentPage = current
      this.updateList()
    },
    handleSearch () {
      this.pageSize = 10
      this.currentPage = 1
      this.updateList()
    },
    async handleToggleStatus ({ status, id }: Course) {
      const tip = status === 1 ? '下架' : '上架'
      const loading = this.$loading({ text: `${tip}中...` })

      await changeState({ status: +!status, courseId: id })
        .finally(() => loading.close())

      this.updateList()
      this.$message.success(`${tip}成功`)
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
