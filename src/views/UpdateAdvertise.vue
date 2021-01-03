<template>
  <advertise-edit :id="id" />
</template>
<script lang="ts">
import Vue from 'vue'
import AdvertiseEdit from '@/components/AdvertiseEdit.vue'

export default Vue.extend({
  name: 'UpdateAdvertise',
  components: {
    AdvertiseEdit
  },
  data () {
    return {
      id: +this.$route.query?.id
    }
  },
  created () {
    if (!this.id) {
      this.$router.replace('/Advertise')
    }
  }
})
</script>
