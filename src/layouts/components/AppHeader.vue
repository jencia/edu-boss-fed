<template>
  <el-header height="50px">
    <el-row type="flex" align="middle" justify="space-between">
      <el-row type="flex" align="middle">
        <el-button :icon="collapseIcon" class="collapse-btn" @click="setCollapse()" />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-dropdown>
        <el-avatar :size="30" :src="userInfo.portrait || iconAvatarDetault" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
  </el-header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { logout, getInfo, UserInfoType } from '@/services/user'
import iconAvatarDetault from '@/assets/icon-avatar-default.png'

interface DataType {
  userInfo: UserInfoType,
  iconAvatarDetault: string
}

export default Vue.extend({
  name: 'AppHeader',
  data () {
    return {
      userInfo: {},
      iconAvatarDetault
    } as DataType
  },
  computed: {
    user () { return this.$store.state.user },
    collapseIcon () {
      return this.$store.state.collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  },
  async mounted () {
    const userInfo = await getInfo()

    this.userInfo = userInfo
  },
  methods: {
    ...mapMutations(['setCollapse']),
    async handleLogout () {
      const loading = this.$loading({ text: '登出中...' })

      await logout()
        .finally(() => loading.close())

      this.$store.commit('setUser', {})
      this.$message.success('登出成功')
      this.$router.push({
        path: '/Login',
        query: {
          redirect: this.$route.fullPath
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0 10px 0 0;
  background: #fff;
}
.collapse-btn {
  margin-right: 10px;
  padding: 15px;
  font-size: 20px;
  border: 0;
  border-radius: 0;
}
</style>
