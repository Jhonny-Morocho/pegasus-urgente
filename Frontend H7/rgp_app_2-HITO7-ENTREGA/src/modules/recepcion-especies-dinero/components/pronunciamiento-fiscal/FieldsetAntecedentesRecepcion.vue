<template>
<p class="col-12 md:col-6">
  <span class="font-bold"> NUE: </span>{{ dataRecepcion.nue }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold"> Fecha de Recepción: </span>{{ dataRecepcion.fechaRecepcion }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold"> Tiempo restante para pronunciamiento: </span>{{ dataRecepcion.tiempoRestante }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold"> Fecha de Ingreso: </span>{{ dataRecepcion.fechaIngreso }}
</p>
<p class="col-12 md:col-6">
  <span class="font-bold"> Institución que Entrega: </span>{{ dataRecepcion.institucionEntrega }}
</p>
</template>
<script setup>
import { propTypes } from '@/modules/common/types'
import { defineProps } from 'vue'
defineProps({
  dataRecepcion: propTypes.object
})
</script>
