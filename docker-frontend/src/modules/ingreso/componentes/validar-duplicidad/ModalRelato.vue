<template>
<section>
  {{ descripcionRelato ?? 'Sin Información' }}
</section>
</template>

<script setup>
import { defineProps, ref, watchEffect } from 'vue'

const sinTagFinal = ref('')
const descripcionRelato = ref('')
watchEffect(() => {
  sinTagFinal.value = props.relato?.relato ? props.relato?.relato.replace('</p>', '') : null
  descripcionRelato.value = sinTagFinal.value ? sinTagFinal.value?.replace('<p>', '') : null
})

const props = defineProps({
  relato: {
    type: Object,
    default: () => null
  }
})
</script>
