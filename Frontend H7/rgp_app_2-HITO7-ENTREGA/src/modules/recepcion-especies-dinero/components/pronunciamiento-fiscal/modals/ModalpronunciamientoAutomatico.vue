<template>
<div class="flex justify-content-center py-4">
  <i
    class="pi pi-exclamation-triangle mr-2"
    style="font-size: 2rem"
  />
  <p class="mt-2">
    Queda a la espera del Pronunciamiento del Fiscal
  </p>
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">Tiempo de espera: </span> {{ props.tiempoEspera }}
    </p>
  </div>
  <div class="col-12">
    <p class="mb-2">
      <span style="font-weight: bold">Fecha/Hora de ingreso de datos del dinero: </span> {{ props.fechaIngresoDatosDinero }}
    </p>
  </div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
const props = defineProps({
  tiempoEspera: propTypes.string,
  fechaIngresoDatosDinero: propTypes.string
})
</script>
