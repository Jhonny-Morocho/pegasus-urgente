<template>
<div
  class="grid"
>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Fecha:</span>
      {{ data.diligencia.fecha }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Tipo de diligencia:</span>
      {{ data.diligencia.tipoDiligencia }}
    </p>
    <p class="">
      <span style="font-weight: bold">Institución Ejecutora:</span>
      {{ data.diligencia.institucionEjecutora }}
    </p>
  </div>
  <div class="col-12 md:col-6">
    <p class="mb-3">
      <span style="font-weight: bold">Estado:</span>
      {{ data.diligencia.estado }}
    </p>
    <p class="mb-3">
      <span style="font-weight: bold">Solicitud de diligencia:</span>
      <i
        v-if="data.diligencia.solicitud"
        class="pi pi-book mx-3"
      />
    </p>
    <p>
      <span style="font-weight: bold">Resultado diligencia:</span>
      <i
        v-if="data.diligencia.resultado"
        class="pi pi-book mx-3"
      />
    </p>
  </div>
  <div class="col-12">
    <span
      style="font-weight: bold"
    >Descripción:</span>
    <p>
      {{ data.diligencia.descripcion }}
    </p>
  </div>
</div>
</template>
<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { defineProps } from 'vue'
const data = defineProps({
  diligencia: propTypes.object
})
</script>
