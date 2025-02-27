<template>
<div class="col-12 md:col-6 py-0">
  <p class="mt-2">
    <span class="font-bold">NUE: </span>{{ data.nue }}
  </p>
  <p class="mt-2">
    <span class="font-bold">RUE: </span>{{ data.rue }}
  </p>
  <p class="mt-2">
    <span class="font-bold">Custodio: </span>{{ data.custodio }}
  </p>
  <p class="mt-2">
    <span class="font-bold">Descripción: </span>{{ data.descripcion }}
  </p>
</div>
<div class="col-12 md:col-6 py-0">
  <p class="mt-2">
    <span class="font-bold">Tipo de Moneda: </span>{{ data.tipoMoneda }}
  </p>
  <p class="mt-2">
    <span class="font-bold">Monto: </span>{{ data.monto }}
  </p>
  <p class="mt-2">
    <span class="font-bold">Tipo de Delito: </span>{{ data.tipoDelito }}
  </p>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import defineProps from 'vue'
defineProps({
  data: propTypes.object
})
</script>
