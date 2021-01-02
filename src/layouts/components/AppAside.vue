<template>
  <div class="app-aside">
    <router-link to="/" class="logo" :class="{ collapse }">
      <img :src="imgLogo" alt="logo">
      <h1>Edu Boss</h1>
    </router-link>
    <el-aside width="auto">
      <el-menu :active="currActive" :collapse="collapse" router>
        <template v-for="menu in finalMenuList">
          <el-submenu v-if="menu.submenuList.length > 0" :key="menu.id" :index="menu.id">
            <template slot="title">
              <i :class="`el-icon-${menu.icon}`" />
              <span slot="title">{{ menu.title }}</span>
            </template>
            <el-menu-item v-for="submenu in menu.submenuList" :key="submenu.id" :index="submenu.href">
              <i :class="`el-icon-${submenu.icon}`" />
              <span slot="title">{{ submenu.title }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :key="menu.id" :index="menu.href">
            <i :class="`el-icon-${menu.icon}`" />
            <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MenuItem } from '@/services/permission'
import imgLogo from '@/assets/logo.png'

export default Vue.extend({
  name: 'AppAside',
  data () {
    return {
      currActive: '/',
      imgLogo,
      permissionsData: {},
      loading: true
    }
  },
  computed: {
    collapse () { return this.$store.state.collapse },
    finalMenuList () {
      interface finalMenuItem {
        id: string,
        href: string
        icon: string
        title: string
        submenuList: finalMenuItem[]
      }
      function formatData (menuList: MenuItem[]): finalMenuItem[] {
        return (menuList || [])
          .filter(menu => menu.shown)
          .map(menu => ({
            id: String(menu.id),
            href: menu.href,
            icon: menu.icon,
            title: menu.name,
            submenuList: menu.subMenuList
              ? formatData(menu.subMenuList)
              : []
          }))
      }

      return formatData(this.$store.state.menuList)
    }
  },
  async mounted () {
    const loading = this.$loading({ text: '加载中..' })

    try {
      await this.$store.dispatch('getUserPermissionsData')
      this.currActive = this.finalMenuList[0].href
    } catch {
    } finally {
      loading.close()
    }
  }
})
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 50px;
  background: #fff;
  color: #495057;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
  transition: width .3s;

  img {
    margin: 10px;
    width: 30px;
  }
  h1 {
    margin: 0;
    width: 90px;
    overflow: hidden;
    font-size: 20px;
    white-space: nowrap;
    transition: width .3s;
  }
  &:hover {
    background: #eceef1;
  }
  &.collapse {
    width: 64px;
    h1 {
      width: 0;
    }
  }
}
.app-aside {
  min-height: 100vh;
  background: #fff;
}
.el-menu {
  border-right: none;
}
</style>
