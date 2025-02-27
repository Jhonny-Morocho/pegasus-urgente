<template>
<Divider layout="horizontal" />
<div class="flex">
  <div class="flex flex-column">
    <p class="mb-3">
      <strong>Imputado(s): </strong>{{ data.data.causa.imputados[0] }}
    </p>
    <p class="my-3">
      <strong>Víctima(s): </strong>{{ data.data.causa.victimas[0] }}
    </p>
    <p class="my-3">
      <strong>RUT Denunciante: </strong>No disponible
    </p>
    <p class="mt-3 mb-2">
      <strong>Fecha/Hora Creación: </strong>{{ dateTimeUtil.formatToFrontendWithTime(data.tarea.taskCreatedOnDates) }}
    </p>
    <p class="mt-3 my-3">
      <strong>Familia Delito: </strong>No disponible
    </p>
    <p class="mt-3 my-3">
      <strong>Lesionados: </strong>{{ data.data.causa.existenLesionados || 'No disponible' }}
    </p>
    <p class="mt-3 my-3">
      <strong>Fallecidos: </strong>{{ data.data.causa.existenFallecidos || 'No disponible' }}
    </p>
  </div>
</div>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'

defineProps({
  data: propTypes.object
})

</script>
