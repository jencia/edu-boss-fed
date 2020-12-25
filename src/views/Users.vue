<template>
  <el-card>
    <el-table :data="tableData.records">
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
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-link
            v-if="row.status === 'ENABLE'"
            :underline="false"
            @click="handleDisableUser(row)"
            style="{ margin-right: 8px }"
          >
            禁用
          </el-link>
          <el-link :underline="false" @click="handleAllocateRole(row)">分配角色</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'

export default Vue.extend({
  name: 'Users',
  data () {
    return {
      tableData: {
        records: [
          {
            id: 100030029,
            name: '用户4567',
            portrait: null,
            phone: '17201234567',
            password: '$2a$10$nGhXkUADbvaopO9gz0YhLOIfG9s1rigN6qee4YBhgfw8ivc784boO',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'ENABLE',
            isDel: false,
            createTime: '2020-12-10T14:05:15.000+0800',
            updateTime: '2020-12-10T14:05:15.000+0800'
          },
          {
            id: 100030028,
            name: '用户2996',
            portrait: null,
            phone: '15510792996',
            password: '$2a$10$40e1NC2qawams1Hk0jVUqOWTjcLOSir1HyUSgCLVvpyXeWmwbiZ0S',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'DISABLE',
            isDel: true,
            createTime: '2020-12-10T14:02:06.000+0800',
            updateTime: '2020-12-25T01:03:50.000+0800'
          },
          {
            id: 100030027,
            name: '用户0875',
            portrait: null,
            phone: '18086060875',
            password: '$2a$10$2e9SkjhlAZ9x5YY33yQj7eH78n9ZhEAFeiGQ8Leb12FF8N3u322oG',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'ENABLE',
            isDel: true,
            createTime: '2020-10-29T16:33:34.000+0800',
            updateTime: '2020-10-29T23:40:47.000+0800'
          },
          {
            id: 100030026,
            name: '18631142258',
            portrait: null,
            phone: '18631142258',
            password: '$2a$10$lH1unwARJZxywCd964tG4OhyxX1g9SRFhqN75c4VSVRFFSfHPF8fO',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'DISABLE',
            isDel: true,
            createTime: '2020-09-28T15:07:47.000+0800',
            updateTime: '2020-12-17T22:43:35.000+0800'
          },
          {
            id: 100030025,
            name: '用户6870',
            portrait: null,
            phone: '17090086870',
            password: '$2a$10$.Njlz4JFOQ3QDv5fKFJm..YTb5Ig05U1oUxMS1I2VznnKJOwaDikK',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'DISABLE',
            isDel: true,
            createTime: '2020-09-23T18:34:33.000+0800',
            updateTime: '2020-12-17T17:40:56.000+0800'
          },
          {
            id: 100030024,
            name: '18631142257',
            portrait: null,
            phone: '18631142257',
            password: '$2a$10$lH1unwARJZxywCd964tG4OhyxX1g9SRFhqN75c4VSVRFFSfHPF8fO',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'DISABLE',
            isDel: true,
            createTime: '2020-09-09T15:41:59.000+0800',
            updateTime: '2020-12-22T22:11:02.000+0800'
          },
          {
            id: 100030022,
            name: '用户8666',
            portrait: null,
            phone: '18201288666',
            password: '$2a$10$zO8M7N/f53OAuyo1GqlW5ujlj3KSeb9lKMwNCNVyuLPNtTfKddo2.',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'ENABLE',
            isDel: true,
            createTime: '2020-07-13T17:43:52.000+0800',
            updateTime: '2020-10-20T15:10:13.000+0800'
          },
          {
            id: 100030021,
            name: '随便',
            portrait: 'https://edu-lagou.oss-cn-beijing.aliyuncs.com/images/2020/10/29/16039604212694953.jpg',
            phone: '15811111111',
            password: '$2a$10$lH1unwARJZxywCd964tG4OhyxX1g9SRFhqN75c4VSVRFFSfHPF8fO',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'ENABLE',
            isDel: false,
            createTime: '2020-07-13T11:35:20.000+0800',
            updateTime: '2020-07-13T11:35:20.000+0800'
          },
          {
            id: 100030020,
            name: '18211111111',
            portrait: null,
            phone: '18211111111',
            password: '$2a$10$zwz0Qp6H0TYZjDs0hKwiU.wKb91ws4xYkfFf1tujgPg/AcPXTChN2',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'DISABLE',
            isDel: true,
            createTime: '2020-07-10T13:57:41.000+0800',
            updateTime: '2020-12-17T20:14:19.000+0800'
          },
          {
            id: 100030019,
            name: '18201288771',
            portrait: 'https://edu-lagou.oss-cn-beijing.aliyuncs.com/images/2020/07/10/15943594999396473.png',
            phone: '18201288771',
            password: '$2a$10$DDOW0oJO9cNm.ZEDNmJmF.AZhsQxoyQ84zSx.UKZBbc58qJWh9HSy',
            regIp: null,
            accountNonExpired: true,
            credentialsNonExpired: true,
            accountNonLocked: true,
            status: 'ENABLE',
            isDel: false,
            createTime: '2020-07-10T12:20:16.000+0800',
            updateTime: '2020-12-04T11:14:48.000+0800'
          }
        ],
        total: 18,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        searchCount: true,
        pages: 2
      }
    }
  },
  methods: {
    handleDisableUser: (data: any) => {
      console.log(data)
    },
    handleAllocateRole: (data: any) => {
      console.log(data)
    }
  },
  filters: {
    date (value: string) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})
</script>

<style lang="scss" scoped>
.el-link + .el-link {
  margin-left: 12px;
}
</style>
