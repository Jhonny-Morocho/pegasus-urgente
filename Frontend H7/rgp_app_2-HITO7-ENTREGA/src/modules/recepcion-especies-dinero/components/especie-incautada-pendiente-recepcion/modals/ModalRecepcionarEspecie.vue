<template>
<div class="flex justify-content-center py-5">
  <i
    class="pi pi-exclamation-triangle mr-2"
    style="font-size: 2rem"
  />
  <h3
    class=""
  >
    ¿Está seguro de querer Recepcionar Especie(s)?
  </h3>
</div>
<div class="text-center">
  <p>
    Decisión:
    <span class="font-bold">
      {{ props.decision }}
    </span>
  </p>
</div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  decision: {
    type: Object,
    default: () => {
      return ''
    }
  }
})
</script>
