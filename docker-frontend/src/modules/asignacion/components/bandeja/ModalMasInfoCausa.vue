<template>
<main>
  <hr class="mb-4">
  <ul>
    <li>
      <strong>Cod. Tarea:</strong> {{ tarea?.taskId }}
    </li>
    <li v-if="dataCausa?.causa?.imputados.length">
      <strong>RUT Imputado (s):</strong> {{ getRutImputados(dataCausa?.causa?.imputados) }}
    </li>
    <li v-if="dataCausa?.causa?.imputados.length">
      <strong>Imputado (s):</strong> {{ getImputado(dataCausa?.causa?.imputados) }}
    </li>
    <li v-if="dataCausa?.causa?.victimas.length">
      <strong>Victima (s):</strong> {{ getVictima(dataCausa?.causa?.victimas) }}
    </li>
    <li>
      <strong>Estado Tarea:</strong> {{ estadoTarea(tarea?.taskStatus) }}
    </li>
    <li
      v-if="dataCausa?.tipoDenuncia"
      class="capitalize"
    >
      <strong>Tipo Denuncia:</strong> {{ dataCausa?.tipoDenuncia }}
    </li>
    <li>
      <strong>Fecha/Hora Asignación:</strong> {{ formatDate(tarea?.taskCreatedOnDate) }}
    </li>
    <li v-if="dataCausa?.causa?.nombre">
      <strong>Nombre Causa:</strong> {{ dataCausa?.causa?.nombre }}
    </li>
    <li v-if="dataCausa?.causa?.delitos.length">
      <strong>Delito (s):</strong> {{ getDelitos(dataCausa?.causa?.delitos) }}
    </li>
    <li>
      <strong>Lesionados:</strong> {{ dataCausa?.causa?.existenLesionados ? 'SI' : 'NO' }}
    </li>
    <li>
      <strong>Fallecidos:</strong> {{ dataCausa?.causa?.existenFallecidos ? 'SI' : 'NO' }}
    </li>
  </ul>
</main>
</template>
<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'
import { format } from '@fiquu/cl-rut'

defineProps({
  dataCausa: propTypes.object,
  tarea: propTypes.object
})

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}

const { mantenedor_getNombreTipoDelito } = useMantenedorStore()

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

function getRutImputados (imputados) {
  const rutImputados = imputados.map(i => format(i.rut))
  return rutImputados.join(', ')
}

function getImputado (imputados) {
  const nombreImputados = imputados.map(i => `${i.nombre} ${i.apellido}`)
  return nombreImputados.join(', ')
}

function getDelitos (delitos) {
  const tiposDelito = delitos?.map(d => mantenedor_getNombreTipoDelito(d?.tipoDelito))
  return tiposDelito.join(', ') || delitos?.map(d => d.hechoDelictual).join(', ')
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
