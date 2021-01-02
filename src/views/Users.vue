<template>
  <div>
    <me-list-form
      ref="listFormRef"
      :data="[
        { label: '手机号', field: 'phone' },
        { label: '注册时间', field: 'createTime', type: 'date-picker' }
      ]"
      :onSearch="handleSearch"
    />
    <el-card>
      <el-table :data="tableData">
        <el-table-column prop="id" label="用户名ID" width="100" />
        <el-table-column label="头像" width="68">
          <template v-slot="{ row }">
            <el-avatar
              :src="row.portrait || 'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="注册时间">
          <template v-slot="{ row }">{{ row.createTime | date }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="{ row }">
            <i class="status" :class="row.status === 'ENABLE' ? 'status-success' : 'status-danger'" />
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="action-col">
          <template v-slot="{ row }">
            <el-link v-if="row.status === 'ENABLE'" :underline="false" @click="handleToggleStatus(row)">
              {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
            </el-link>
            <el-link :underline="false" @click="handleAllocateRole(row)">分配角色</el-link>
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

      <el-dialog title="分配角色" :visible.sync="dialogVisible">
        <el-select v-model="currentRoleIdList" multiple style="width: 100%">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import { getUserPages, forbidUser, enableUser, UserType } from '@/services/user'
import { getAllRole, getUserRole, allocateUserRoles } from '@/services/role'
import Vue from 'vue'

export default Vue.extend({
  name: 'Users',
  data () {
    return {
      tableData: [] as UserType[],
      page: {
        current: 1,
        size: 10
      },
      dataTotal: 0,
      currentUserId: -1,
      currentRoleIdList: [] as number[],
      roleOptions: [] as { label: string, value: number }[],
      dialogVisible: false
    }
  },
  mounted () {
    this.updateList()
    this.initRoleOptions()
  },
  methods: {
    async updateList () {
      const { formData } = this.$refs.listFormRef as any
      const requestData = {
        phone: formData.phone,
        startCreateTime: formData.createTime[0],
        endCreateTime: formData.createTime[1],
        currentPage: this.page.current,
        pageSize: this.page.size
      }
      const loading = this.$loading({ text: '加载中...' })

      try {
        const data = await getUserPages(requestData)

        this.tableData = data.records
        this.dataTotal = data.total
      } catch (e) {
      } finally {
        loading.close()
      }
    },
    async initRoleOptions () {
      const data = await getAllRole()

      this.roleOptions = data.map(v => ({
        label: v.name,
        value: v.id
      }))
    },
    async handleToggleStatus (row: UserType) {
      const isEnable = row.status !== 'ENABLE'
      const msg = isEnable ? '启用' : '禁用'
      let loading

      try {
        const rs = await this.$confirm(`是否${msg}？`, '提示')

        if (rs !== 'confirm') {
          return
        }
        loading = this.$loading({ text: `${msg}中...` })
        await (isEnable ? enableUser : forbidUser)(row.id)

        this.updateList()
      } catch (e) {
      } finally {
        loading && loading.close()
      }
    },
    async handleAllocateRole (row: UserType) {
      const data = await getUserRole(row.id)

      this.currentRoleIdList = data.map((v: { id: number }) => v.id)
      this.currentUserId = row.id
      this.dialogVisible = true
    },
    async handleSave () {
      const loading = this.$loading({ text: '分配中...' })

      try {
        await allocateUserRoles({
          userId: this.currentUserId,
          roleIdList: this.currentRoleIdList
        })
        this.$message.success('角色分配成功')
        this.dialogVisible = false
      } catch (e) {
        this.$message.error('角色分配失败')
      } finally {
        loading.close()
      }
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
