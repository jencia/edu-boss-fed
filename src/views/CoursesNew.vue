<template>
  <course-edit />
</template>
<script lang="ts">
import Vue from 'vue'
import CourseEdit from '@/components/CourseEdit.vue'

export default Vue.extend({
  name: 'CoursesNew',
  components: {
    CourseEdit
  }
})
</script>
