<template>
<section>
  <Editor
    id="editor-ver-escrito"
    v-model="textoEscrito"
    class="w-full"
    editor-style="height: 256px"
    :readonly="true"
  >
    <template #toolbar>
      <p class="hidden" />
    </template>
  </Editor>
</section>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

const props = defineProps({
  data: propTypes.string
})

const textoEscrito = ref(props.data)
</script>
<style scoped lang="scss">
::v-deep(.p-editor-toolbar) {
  padding: 0;
}
</style>
