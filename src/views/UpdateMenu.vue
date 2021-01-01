<template>
  <menu-edit :id="id" />
</template>
<script lang="ts">
import Vue from 'vue'
import MenuEdit from '@/components/MenuEdit.vue'

export default Vue.extend({
  name: 'UpdateMenu',
  components: {
    MenuEdit
  },
  data () {
    return {
      id: +this.$route.query?.id
    }
  },
  created () {
    if (!this.id) {
      this.$router.replace('/Menu')
    }
  }
})
</script>
