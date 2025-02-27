<template>
<div class="flex">
  <p><strong>RUC: </strong>{{ especie?.ruc }}</p>
  <p><strong>RUE: </strong>{{ especie?.rue }}</p>
  <p><strong>Familia Especie: </strong>{{ especie?.familiaEspecie }}</p>
  <p><strong>Fecha recepcion Solicitud: </strong>{{ especie?.fechaRecepcionSolicitud }}</p>
  <p><strong>Disponibilidad para Insepccion: </strong>{{ especie?.fechaDisponibleInspeccion }}</p>
</div>
</template>

<script setup>
import { reactive } from 'vue'

const especie = reactive({
  ruc: '',
  rue: '',
  familiaEspecie: '',
  fechaRecepcionSolicitud: '',
  fechaDisponibleInspeccion: ''
})
</script>
