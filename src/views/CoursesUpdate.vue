<template>
  <course-edit :id="id" />
</template>
<script lang="ts">
import Vue from 'vue'
import CourseEdit from '@/components/CourseEdit.vue'

export default Vue.extend({
  name: 'CoursesUpdate',
  components: {
    CourseEdit
  },
  data () {
    return {
      id: +this.$route.params?.id
    }
  },
  created () {
    if (!this.id) {
      this.$router.replace('/Courses')
    }
  }
})
</script>
