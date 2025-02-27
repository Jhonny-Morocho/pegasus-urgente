<template>
<main
  v-if="loading"
  class="w-full formgrid grid px-4 py-0 mt-2 mx-0"
>
  <LoaderSkeleton height="35vh" />
</main>
<main
  v-else
  class="w-full formgrid grid px-4 py-0 mt-2 mx-0"
>
  <ul class="col-12 md:col-6 list-none flex flex-column gap-3">
    <li>
      <div
        v-if="resumenCausa?.alertas?.length"
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
      </div>
      <div v-else>
        <strong>Alertas: </strong> Sin Alertas
      </div>
    </li>
    <li><strong>RUC: </strong> {{ resumenCausa?.ruc }} </li>
    <li><strong>Nombre Causa: </strong> {{ resumenCausa?.nombreCausa }} </li>
    <li><strong>Causa Reservada: </strong> {{ resumenCausa?.esReservada }} </li>
    <li><strong>Fecha Creación Causa: </strong> {{ formatDate(resumenCausa?.fechaCreacion, true) }} </li>
    <li><strong>Fiscalía Local: </strong> {{ resumenCausa?.nombreFiscaliaLocal }} </li>
    <li><strong>Fiscal Asignado: </strong> {{ resumenCausa?.nombreFiscalAsignado || 'Sin Fiscal Asignado' }} </li>
    <li><strong>Estado de la Causa: </strong> {{ resumenCausa?.descripcionEstado || 'Estado Desconocido' }} </li>
    <li><strong>Fecha de Prescripción</strong> {{ formatDate(resumenCausa?.fechaPrescripcion) }} </li>
  </ul>
  <ul class="col-12 md:col-6 list-none flex flex-column gap-3">
    <li><strong>Proceso de la Causa: </strong>{{ resumenCausa?.descripcionProceso || 'Proceso Desconocido' }}</li>
    <li><strong>Estado de las Relaciones de la Causa: </strong>{{ resumenCausa?.descripcionEstadoRelacion || 'Estado Desconocido' }}</li>
    <li><strong>Etapa de las Relaciones de la Causa: </strong>{{ resumenCausa?.etapaRelacionesCausa || 'Etapa Desconocida' }}</li>
    <li><strong>Estado Procesal: </strong>{{ resumenCausa?.estadoProcesal || 'Estado Desconocido' }}</li>
    <li><strong>Fecha Asignación: </strong>{{ formatDate(resumenCausa?.fechaAsignacion) }}</li>
    <li><strong>Fecha Formalización: </strong>{{ formatDate(resumenCausa?.fechaFormalizacion) }}</li>
    <li><strong>Plazo Investigación: </strong>{{ resumenCausa?.plazoInvestigacionDias }} Días</li>
  </ul>
</main>
</template>

<script setup>
import { defineProps } from 'vue'
import { propTypes } from '@/modules/common/types'
import { dateTimeUtil } from '@/utils'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

defineProps({
  resumenCausa: propTypes.object,
  loading: Boolean
})

function formatDate (fecha, hasTime) {
  let fechaParsed = null

  if (fecha && hasTime) {
    fechaParsed = dateTimeUtil.formatToFrontendWithTime(fecha)
    return fechaParsed
  } else if (fecha && !hasTime) {
    fechaParsed = dateTimeUtil.formatToFrontend(fecha)
    return fechaParsed
  } else {
    return 'Fecha Desconocida'
  }
}
</script>
