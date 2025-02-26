<template>
<div class="grid col-12">
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">Cantidad Solicitada: </span> {{ props.cantidad }}
    </p>
  </div>
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">Fecha: </span> {{ props.fecha }}
    </p>
  </div>
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">Observaciones: </span> {{ props.observaciones }}
    </p>
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
const props = defineProps({
  cantidad: propTypes.string,
  fecha: propTypes.string,
  observaciones: propTypes.string
})
</script>
