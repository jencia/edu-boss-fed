<template>
  <div ref="editorRef" />
</template>

<script lang="ts">
import Vue from 'vue'
import Editor from 'wangeditor'

export default Vue.extend({
  name: 'RichEditor',
  props: {
    value: String
  },
  data () {
    return {
      editor: null as Editor | null
    }
  },
  mounted () {
    const editor = new Editor(this.$refs.editorRef as any)

    editor.config.zIndex = 100
    editor.config.onchange = (value: string) => {
      this.$emit('input', value)
    }
    editor.create()

    editor.txt.html(this.value)
    this.editor = editor
  },
  watch: {
    value (v) {
      this.editor!.txt.html(this.value)
    }
  },
  beforeDestroy () {
    this.editor!.destroy()
    this.editor = null
  }
})
</script>
