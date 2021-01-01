<template>
  <menu-edit />
</template>
<script lang="ts">
import Vue from 'vue'
import MenuEdit from '@/components/MenuEdit.vue'

export default Vue.extend({
  name: 'AddMenu',
  components: {
    MenuEdit
  }
})
</script>
