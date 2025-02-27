<template>
<section>
  <div
    class="img-documento w-full p-fluid grid col-12"
  >
    <iframe
      v-for="d in dataDocumento.data"
      :key="d"
      :class=" dataDocumento.data.length > 1 ? 'md:col-6 iframe px-3': 'col-12 iframe ' "
      :src="`data:${d?.mimeType};base64,` + d?.documento"
      style="height: 300px;"
      title="Documento"
    />
    <Divider layout="vertical" />
  </div>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
defineProps({
  dataDocumento: propTypes.array
})
</script>
<style scoped>
.img-documento {
  width: 100%;
  height: 100%;
  text-align: center;
}
.iframe {
  max-width: 100%;
  height: auto;
}
</style>
