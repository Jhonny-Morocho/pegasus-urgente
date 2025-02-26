<template>
<section>
  <div class="img-documento w-full p-fluid">
    <Image
      v-if="mimeType.includes('image')"
      id="imagen-sujeto-delictual"
      image-class="w-full"
      preview
      :src="`data:${mimeType};base64,` + archivo"
    />
    <iframe
      v-else
      class="iframe"
      :src="`data:${mimeType};base64,` + archivo"
      style="height: 1400px; width: 1300px"
      title="Documento"
    />
  </div>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types'
import { computed, defineProps, inject, reactive } from 'vue'
const dialogRef = inject('dialogRef')

const props = defineProps({
  dataDocumento: propTypes.object
})
const propsInject = reactive({
  ...dialogRef.value?.data.dataDocumento
})

const mimeType = computed(() => {
  if (props.dataDocumento) {
    return props.dataDocumento.mimeType
  } else return propsInject.mimeType
})
console.log(mimeType.value)
const archivo = computed(() => {
  if (props.dataDocumento) {
    return props.dataDocumento.archivo
  } else return propsInject.archivo
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
