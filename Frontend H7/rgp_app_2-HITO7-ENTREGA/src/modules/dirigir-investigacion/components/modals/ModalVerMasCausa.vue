<template>
<main>
  <hr class="mb-4">
  <ul>
    <li><strong>Imputado(s): </strong> {{ data?.imputados.length || 0 }}</li>
    <li><strong>Victima(s): </strong> {{ data?.victimas.length || 0 }}</li>
    <li><strong>Nombre Causa: </strong> {{ data?.nombre || 'N/A' }}</li>
    <li>
      <strong>Familia Delito: </strong>
      {{
        data?.delitos.length
          ? mantenedor_getNombreTipoDelito(data?.delitos[0].tipoDelito)
          : 'Sin Delito'
      }}
    </li>
    <li>
      <strong>Lesionados: </strong>
      {{ data?.existenLesionados ? 'SI' : 'NO' }}
    </li>
    <li>
      <strong>Fallecidos: </strong>
      {{ data?.existenFallecidos ? 'SI' : 'NO' }}
    </li>
    <li>
      <strong>Fecha/Hora Creación: </strong>
      {{ formatFecha(data?.fechaCreacion) }}
    </li>
    <li>
      <strong>Fecha/Hora Asignación: </strong>
      {{ formatFecha(data?.fechaAsignacion) || null }}
    </li>
  </ul>
</main>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getNombreTipoDelito } = useMantenedorStore()

defineProps({
  data: propTypes.object
})

// eslint-disable-next-line no-unused-vars
function formatFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontendWithTime(fecha)
  } else {
    return '--'
  }
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
