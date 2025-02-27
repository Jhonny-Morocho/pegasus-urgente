<template>
<section>
  <div class="img-documento">
    <Image
      id="imagen-sujeto-delictual"
      image-class="w-full"
      preview
      :src="`data:${props.mimeType};base64,` + props?.archivo"
    />
  </div>
</section>
</template>

<script setup>
import { inject, reactive } from 'vue'
const dialogRef = inject('dialogRef')

const props = reactive({
  ...dialogRef.value?.data
})

console.log('props', props)
</script>

<style scoped>
.img-documento {
  padding: 0;
  height: 800px;
  text-align: center;
}
</style>
