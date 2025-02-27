<template>
<div class="flex justify-content-center py-4">
  <i
    class="pi pi-exclamation-triangle mr-2"
    style="font-size: 2rem"
  />
  <p
    v-if="!existeDuplicidad"
    class="mt-2"
  >
    No se encontraron posibles Causas Duplicadas
  </p>
  <p
    v-else
    class="mt-2"
  >
    Se encontraron posibles Causas Duplicadas
  </p>
</div>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps({
  existeDuplicidad: {
    type: Boolean,
    default: () => false
  }
})
</script>
