<template>
<div class="col-12 md:col-6">
  <p class="mb-3">
    <span class="font-bold">NUE: </span>{{ data?.nue }}
  </p>
  <p class="mb-3">
    <span class="font-bold">RUE: </span>{{ data?.rue }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Tipo de Delito: </span>{{ data?.tipoDelito }}
  </p>
  <p><span class="font-bold">Responsable de UAF: </span>{{ data?.responsableUaf }}</p>
</div>
<div class="col-12 md:col-6">
  <p class="mb-3">
    <span class="font-bold">Tipo de Moneda: </span>{{ data?.tipoMoneda }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Monto: </span>{{ data?.monto }}
  </p>
  <p class="mb-3">
    <span class="font-bold">Interés: </span>{{ data?.interes }}
  </p>
  <p><span class="font-bold">Monto total: </span>{{ data?.monto + data?.interes }}</p>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'

defineProps({
  data: propTypes.object
})
</script>
