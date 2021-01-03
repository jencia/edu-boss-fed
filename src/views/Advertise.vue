<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button size="small" @click="$router.push('/addAdvertise')">添加广告</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading">
        <el-table-column width="60" prop="id" label="id" />
        <el-table-column prop="name" label="广告名称" />
        <el-table-column prop="spaceName" label="广告位置" />
        <el-table-column label="广告图片">
          <template v-slot="{ row }">
            <img :src="row.img" :alt="row.name" style="width: 100%" />
          </template>
        </el-table-column>
        <el-table-column label="时间" width="250">
          <template v-slot="{ row }">
            <p>开始时间：{{ row.startTimeFormatString }}</p>
            <p>到期时间：{{ row.endTimeFormatString }}</p>
          </template>
        </el-table-column>
        <el-table-column label="上线/下线" width="100">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleSwitchStatus(row, $event)"
            />
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" class-name="action-col">
          <template v-slot="{ row }">
            <el-link
              :underline="false"
              @click="$router.push(`/updateAdvertise?id=${row.id}`)"
            >
              编辑
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAdList, getAllSpaces, AdType, updateAdStatus } from '@/services/ad'

export default Vue.extend({
  name: 'Advertise',
  data () {
    return {
      tableData: [] as AdType[],
      loading: false
    }
  },
  mounted () {
    this.updateList()
  },
  methods: {
    async updateList () {
      this.loading = true
      const [adList, spaceList] = await Promise.all([
        getAdList(),
        getAllSpaces()
      ])
        .finally(() => (this.loading = false))

      this.tableData = adList.map(ad => {
        const currentSpace = spaceList.find(space => space.id === ad.spaceId)

        ad.spaceName = currentSpace ? currentSpace.name : ''
        return ad
      })
    },
    async handleSwitchStatus (row: AdType, status: 0 | 1) {
      let loading

      try {
        const rs = await this.$confirm('是否要修改上线/下线状态?', '提示')

        if (rs !== 'confirm') {
          return
        }
        loading = this.$loading({ text: '切换状态中...' })
        await updateAdStatus({ id: row.id, status })

        this.$message.success('修改成功')
      } catch (e) {
        row.status = +!status
      } finally {
        loading && loading.close()
      }
    }
  }
})
</script>
