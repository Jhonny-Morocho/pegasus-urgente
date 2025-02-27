<template>
<div v-if="isLoadingResumen">
  <LoaderSkeleton
    height="369px"
  />
</div>
<div
  v-else
  class="grid w-full"
>
  <div class="col-12 md:col-6 pl-4">
    <p
      v-if="causa?.alertas?.length >= 1"
      class="flex align-self-center mb-1"
    >
      <strong class="flex align-self-center mr-2">Alertas: </strong>
      <span class="flex">
        <ChipAlerta
          v-for="(alerta, index) in causa?.alertas"
          :key="index"
          :alerta="alerta"
          class="m-1"
        />
      </span>
    </p>
    <p v-else>
      <strong>Alertas: </strong>N/A
    </p>
    <p><strong>RUC: </strong>{{ ruc }}</p>
    <p><strong>Nombre Causa: </strong>{{ causa?.nombreCausa }}</p>
    <p><strong>Causa Reservada: </strong>{{ causa?.esReservada }}</p>
    <p><strong>Fecha Creación Causa: </strong>{{ formatearFechaHora(causa?.fechaCreacion) }}</p>
    <p><strong>Fiscalía Local: </strong>{{ causa?.nombreFiscaliaLocal || 'N/A' }}</p>
    <p><strong>Fiscal Asignado: </strong>{{ causa?.nombreFiscalAsignado || 'N/A' }}</p>
    <p><strong>Plazo investigación: </strong>{{ causa?.plazoInvestigacionDias ? causa?.plazoInvestigacionDias + 'DÍAS' : 'N/A' }}</p>
  </div>
  <div class="col-12 md:col-6 pr-4">
    <p><strong>Estado de la Causa: </strong>{{ causa?.descripcionEstado || 'N/A' }}</p>
    <p><strong>Proceso de la Causa: </strong>{{ causa?.descripcionProceso || 'N/A' }}</p>
    <p><strong>Etapa de las Relaciones de la Causa: </strong>{{ causa?.etapaRelacionesCausa || 'N/A' }}</p>
    <p><strong>Fecha Asignación: </strong>{{ formatearFechaHora(causa?.fechaAsignacion) }}</p>
    <p><strong>Fecha Formalización: </strong>{{ formatearFechaHora(causa?.fechaFormalizacion) }}</p>
    <p><strong>Fecha de Término o Suspensión: </strong>{{ formatearFechaHora(causa?.fechaTerminoOSuspension) }}</p>
    <p><strong>Fecha de Prescripción: </strong>{{ formatearFechaHora(causa?.fechaPrescripcion) }}</p>
  </div>
</div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { requestUtil, dateTimeUtil } from '@/utils'
import { propTypes } from '@/modules/common/types'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'
import LoaderSkeleton from '@/modules/common/components/LoaderSkeleton.vue'

const props = defineProps({
  ruc: propTypes.string
})

const isLoadingResumen = ref(false)

const causa = ref()

const {
  dirigirInvestigacion_getResumenCausa
} = useDirigirInvestigacionStore()

function getResumentCausa () {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: props?.ruc },
    resolve: (data) => { causa.value = data },
    loader: (l) => (isLoadingResumen.value = l)
  })
}

onMounted(() => {
  getResumentCausa()
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
