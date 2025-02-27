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
      <p class="m-0 p-0 w-0 h-0" />
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
