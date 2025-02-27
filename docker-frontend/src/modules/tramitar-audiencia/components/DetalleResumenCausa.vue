<template>
<div class="grid w-full">
  <div class="col-12 md:col-6 pl-4">
    <p
      v-if="resumenCausa?.alertas?.length > 0"
      class="flex align-self-center mb-1"
    >
      <strong class="flex align-self-center mr-2">Alertas: </strong>
      <span class="flex">
        <ChipAlerta
          v-for="(alerta) in resumenCausa?.alertas"
          :key="alerta"
          :alerta="alerta"
          class="m-1"
        />
      </span>
    </p>
    <p v-else>
      <strong>Alertas: </strong> {{ resumenCausa?.alerta || 'N/A' }}
    </p>
    <p><strong>RUC: </strong>{{ resumenCausa?.ruc ?? resumenCausa.rolUnico }}</p>
    <p><strong>Nombre Causa: </strong>{{ resumenCausa?.nombreCausa ?? 'Causa sin nombre' }}</p>
    <p><strong>Causa Reservada: </strong>{{ resumenCausa?.esReservaDeDatos ? 'Si' :'No' || 'Por Definir' }}</p>
    <p><strong>Fecha Creación Causa: </strong>{{ formatearFechaHora(resumenCausa?.fechaHoraCreacion ?? resumenCausa?.fechaCreacion) }}</p>
    <p><strong>Fiscalía Local: </strong>{{ resumenCausa?.nombreFiscaliaLocal || 'N/A' }}</p>
    <p><strong>Fiscal Asignado: </strong>{{ resumenCausa?.fiscalPropuesto || 'N/A' }}</p>
    <p><strong>Plazo investigación: </strong>{{ resumenCausa?.plazoInvestigacionDias ? resumenCausa?.plazoInvestigacionDias + 'DÍAS' : 'N/A' }}</p>
  </div>
  <div class="col-12 md:col-6 pr-4">
    <p><strong>Estado de la Causa: </strong>{{ resumenCausa?.idEstado ? mantenedor_getDescripcionEstadoCausaById(resumenCausa?.idEstado) : 'N/A' }}</p>
    <p><strong>Proceso de la Causa: </strong>{{ resumenCausa?.descripcionProceso || 'N/A' }}</p>
    <p><strong>Etapa de las Relaciones de la Causa: </strong>{{ resumenCausa?.etapaRelacionesCausa || 'N/A' }}</p>
    <p><strong>Fecha Asignación: </strong>{{ formatearFechaHora(resumenCausa?.fechaHoraAsignacion, true) }}</p>
    <p><strong>Fecha Formalización: </strong>{{ formatearFechaHora(resumenCausa?.fechaFormalizacion) }}</p>
    <p><strong>Fecha de Prescripción: </strong>{{ formatearFechaHora(resumenCausa?.fechaPrescripcion) }}</p>
  </div>
</div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const { mantenedor_getDescripcionEstadoCausaById, mantenedor_getEstadosCausa } = useMantenedorStore()

onMounted(() => {
  mantenedor_getEstadosCausa()
})

defineProps({
  causa: propTypes.object,
  antecedentes: propTypes.object,
  resumenCausa: propTypes.object
})

function formatearFechaHora (fecha, noTime) {
  let fechaParsed = null

  if (fecha && !noTime) {
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
