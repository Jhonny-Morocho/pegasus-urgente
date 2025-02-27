<template>
<div
  class="grid"
>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Usuario:</span>
      {{ data.anotacion.usuario }}
    </p>
    <p>
      <span style="font-weight: bold">Cargo:</span>
      {{ data.anotacion.cargo }}
    </p>
  </div>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Etapa:</span>
      {{ data.anotacion.etapa }}
    </p>
    <p>
      <span style="font-weight: bold">Fecha:</span>
      {{ data.anotacion.fecha }}
    </p>
  </div>
  <div class="col-12">
    <span
      style="font-weight: bold"
    >Anotación:</span>
    <p>
      {{ data.anotacion.anotacion }}
    </p>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
const data = defineProps({
  anotacion: propTypes.object
})
</script>
