<template>
<div class="col-12 md:col-6 pl-4 flex flex-column">
  <p>
    <strong>RUC: </strong><span class="text-blue-500 font-medium">{{ causa?.ruc || causa?.rolUnico }}</span>
  </p>
  <p><strong>Nombre Causa: </strong>{{ causa?.nombreCausa || causa?.nombre || 'N/A' }}</p>
  <p><strong>Causa Reservada: </strong>{{ esReservada(causa?.esReservada) }}</p>
  <p><strong>Fecha Creación Causa: </strong>{{ dateTimeUtil.formatToFrontendWithTime(causa?.fechaCreacion) || 'N/A' }}</p>
  <p><strong>Fiscalía Local: </strong>{{ causa?.nombreFiscaliaLocal || causa?.fiscalia || 'N/A' }}</p>
  <p><strong>Fiscal Asignado: </strong>{{ causa?.nombreFiscalAsignado || causa?.fiscalAsignado || 'N/A' }}</p>
  <p><strong>Estado de la Causa: </strong>{{ causa?.descripcionEstado || 'N/A' }}</p>
  <p><strong>Fecha de Prescripción: </strong>{{ causa?.fechaPrescripcion || 'N/A' }}</p>
</div>
<div class="col-12 md:col-6 pl-4 flex flex-column">
  <p><strong>Proceso de la Causa: </strong>{{ causa?.descripcionProceso || 'N/A' }}</p>
  <p><strong>Estado de las Relaciones de la Causa: </strong>{{ causa?.descripcionEstadoRelacion || 'N/A' }}</p>
  <p><strong>Etapa de las Relaciones de la Causa: </strong>{{ causa?.etapaRelacionesCausa || 'N/A' }}</p>
  <p><strong>Estado Procesal: </strong>{{ causa?.estadoProcesal || 'N/A' }}</p>
  <p><strong>Fecha Asignación: </strong>{{ causa?.fechaAsignacion || 'N/A' }}</p>
  <p><strong>Fecha Formalización: </strong>{{ causa?.fechaFormalizacion || 'N/A' }}</p>
  <p><strong>Plazo investigación: </strong>{{ causa?.plazoInvestigacionDias ? `${causa?.plazoInvestigacionDias} DIAS` : 'N/A' }}</p>
</div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'

const props = defineProps({
  causa: propTypes.object
})

const causa = ref(props.causa)

function esReservada (value) {
  return value ? 'Si' : 'No'
}
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
