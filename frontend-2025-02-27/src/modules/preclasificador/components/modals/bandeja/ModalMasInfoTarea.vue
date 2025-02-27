<template>
<section>
  <div>
    <hr class="mb-6">
    <ul>
      <li>
        <strong>Código Tarea: </strong>
        {{ tarea?.taskProcessInstanceId }}
      </li>
      <li v-show="false">
        <strong>Origen Denuncia: </strong>
        {{ origenDenuncia }}
      </li>
      <li>
        <strong>N° Imputados: </strong>
        {{ dataCausa?.causa?.imputados?.length }}
      </li>
      <li v-if="dataCausa?.causa.victimas.length">
        <strong>Víctima: </strong>
        {{ getVictima(dataCausa?.causa.victimas) }}
      </li>
      <li>
        <strong>Estado Tarea: </strong>
        {{ estadoTarea(tarea?.taskStatus) }}
      </li>
      <li>
        <strong>Lesionados: </strong>
        {{ dataCausa?.causa?.existenLesionados ? 'Si' : 'No' }}
      </li>
      <li>
        <strong>Fallecidos: </strong>
        {{ dataCausa?.causa?.existenFallecidos ? 'Si' : 'No' }}
      </li>
      <li v-if="dataCausa?.causa?.fechaCreacion">
        <strong>Fecha/Hora Creación: </strong>
        {{ formatFecha(dataCausa?.causa?.fechaCreacion) }}
      </li>
    </ul>
  </div>
</section>
</template>

<script setup>
import { propTypes } from '@/modules/common/types/prop.types'
import { dateTimeUtil } from '@/utils'
import { defineProps } from 'vue'

defineProps({
  tarea: propTypes.object,
  dataCausa: propTypes.object
})

function formatFecha (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

function estadoTarea (estado) {
  switch (estado) {
    case 'Created':
      return 'Creada'
    case 'Ready':
      return 'Pendiente'
    case 'Reserved':
      return 'Reservada'
    case 'InProgress':
      return 'En Progreso'
    case 'Completed':
      return 'Completa'
    default:
      return 'Estado Desconocido'
  }
}

function getVictima (victimas) {
  const nombreVictimas = victimas.map(v => `${v.nombre} ${v.apellido}`)
  return nombreVictimas.join(', ')
}

</script>
<style lang="scss" scoped>
ul {
  list-style: none;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
li {
  font-size: 1.2rem;
}
</style>
