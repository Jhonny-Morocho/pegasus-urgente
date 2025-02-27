<template>
<div class="grid w-full">
  <div class="col-12 md:col-6 pl-4">
    <p
      v-if="resumenCausa?.alertas?.length >= 1"
      class="flex align-self-center mb-1"
    >
      <strong class="flex align-self-center mr-2">Alertas: </strong>
      <span class="flex">
        <ChipAlerta
          v-for="(alerta, index) in resumenCausa?.alertas"
          :key="index"
          :alerta="alerta"
          class="m-1"
        />
      </span>
    </p>
    <p v-else>
      <strong>Alertas: </strong>N/A
    </p>
    <p><strong>RUC: </strong>{{ resumenCausa?.ruc }}</p>
    <p><strong>Nombre Causa: </strong>{{ resumenCausa?.nombreCausa }}</p>
    <p><strong>Causa Reservada: </strong>{{ resumenCausa?.esReservada }}</p>
    <p><strong>Fecha Creación Causa: </strong>{{ formatearFechaHora(resumenCausa?.fechaCreacion, false, true) }}</p>
    <p><strong>Fiscalía Local: </strong>{{ resumenCausa?.nombreFiscaliaLocal || 'N/A' }}</p>
    <p><strong>Fiscal Asignado: </strong>{{ resumenCausa?.nombreFiscalAsignado || 'N/A' }}</p>
    <p><strong>Plazo investigación: </strong>{{ resumenCausa?.plazoInvestigacionDias ? resumenCausa?.plazoInvestigacionDias + 'DÍAS' : 'N/A' }}</p>
  </div>
  <div class="col-12 md:col-6 pr-4">
    <p><strong>Estado de la Causa: </strong>{{ resumenCausa?.descripcionEstado || 'Vigente' }}</p>
    <p><strong>Proceso de la Causa: </strong>{{ resumenCausa?.descripcionProceso || 'N/A' }}</p>
    <p><strong>Estado Procesal: </strong>{{ resumenCausa?.estadoProcesal || 'N/A' }}</p>
    <p><strong>Estado de las Relaciones de la Causa: </strong>{{ resumenCausa?.descripcionEstadoRelacion || 'N/A' }}</p>
    <p><strong>Etapa de las Relaciones de la Causa: </strong>{{ resumenCausa?.etapaRelacionesCausa || 'N/A' }}</p>
    <p><strong>Fecha Asignación: </strong>{{ formatearFechaHora(resumenCausa?.fechaAsignacion, true) }}</p>
    <p><strong>Fecha Formalización: </strong>{{ formatearFechaHora(resumenCausa?.fechaFormalizacion) }}</p>
    <p><strong>Fecha de Término o Suspensión: </strong>{{ formatearFechaHora(resumenCausa?.fechaTerminoOSuspension) }}</p>
    <p><strong>Fecha de Prescripción: </strong>{{ formatearFechaHora(resumenCausa?.fechaPrescripcion) }}</p>
  </div>
</div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { dateTimeUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useMantenedorStore } from '@/modules/global/composables'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'

const { mantenedor_getEstadosCausa } = useMantenedorStore()

onMounted(() => {
  mantenedor_getEstadosCausa()
})

defineProps({
  resumenCausa: propTypes.object
})

function formatearFechaHora (fecha, noTime = false, flagRestantes = false) {
  let fechaParsed = null

  if (fecha && !noTime) {
    if (flagRestantes) {
      fechaParsed = dateTimeUtil.addNMinutes(fecha, -180)
      return fechaParsed
    }
    fechaParsed = dateTimeUtil.formatToFrontendWithTime(fecha)
    return fechaParsed
  } else if (fecha && noTime) {
    fechaParsed = dateTimeUtil.formatToFrontend(fecha)
    return fechaParsed
  } else {
    return 'N/A'
  }
}
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
