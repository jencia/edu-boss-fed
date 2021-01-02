<template>
  <el-container class="default-layout">
    <app-aside />
    <el-container direction="vertical">
      <app-header />
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'

export default Vue.extend({
  name: 'DefaultLayout',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style lang="scss" scoped>
.default-layout {
  height: 100vh;
}
</style>
