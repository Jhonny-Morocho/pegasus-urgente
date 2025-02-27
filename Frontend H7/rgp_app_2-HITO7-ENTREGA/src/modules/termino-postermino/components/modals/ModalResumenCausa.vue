<template>
<div class="grid w-full">
  <div class="col-12 md:col-6 pl-4">
    <p class="flex align-self-center">
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
    <p><strong>RUC: </strong>{{ antecedentes?.ruc }}</p>
    <p><strong>Nombre Causa: </strong>{{ causa?.nombreCausa }}</p>
    <p><strong>Causa Reservada: </strong>{{ causa?.esReservada ? 'Si' : 'No' }}</p>
    <p><strong>Fecha Creación Causa: </strong>{{ causa?.antecedentes?.fechaHoraDenuncia || 'N/A' }}</p>
    <p><strong>Fiscalía Local: </strong>{{ fiscaliaLocal?.nombreFiscalia || 'N/A' }}</p>
    <p><strong>Fiscal Asignado: </strong>{{ causa?.antecedentes?.fiscalAsignado || 'N/A' }}</p>
    <p><strong>Plazo investigación: </strong>{{ causa?.plazoInvestigacionDias }} DÍAS</p>
  </div>
  <div class="col-12 md:col-6 pr-4">
    <p><strong>Estado de la Causa: </strong>{{ antecedentes?.estado || 'N/A' }}</p>
    <p><strong>Proceso de la Causa: </strong>{{ causa?.descripcionProceso || 'N/A' }}</p>
    <p><strong>Etapa de las Relaciones de la Causa: </strong>{{ causa?.etapaRelacionesCausa || 'N/A' }}</p>
    <p><strong>Fecha Asignación: </strong>{{ causa?.fechaAsignacion || 'N/A' }}</p>
    <p><strong>Fecha Formalización: </strong>{{ causa?.fechaFormalizacion || 'N/A' }}</p>
    <p><strong>Fecha de Término o Suspensión: </strong>{{ causa?.fechaTerminoOSuspension || 'N/A' }}</p>
    <p><strong>Fecha de Prescripción: </strong>{{ causa?.fechaPrescripcion || 'N/A' }}</p>
  </div>
</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { requestUtil } from '@/utils'
import ChipAlerta from '@/modules/global/components/utilities/ChipAlerta.vue'
import { useTermino } from '../../composables'
import { useAntecedentesCausaStore } from '@/modules/global/composables'

const { ruc, resumenCausa: causa } = useTermino()
const { antecedentes, fiscaliaLocal, antecedentesCausa_getAntecedentesCausa } = useAntecedentesCausaStore()

function getResumentCausa () {
  requestUtil({
    action: antecedentesCausa_getAntecedentesCausa,
    payload: { ruc: ruc.value },
    resolve: (data) => {
      causa.value = data
    }
  })
}

onMounted(() => {
  getResumentCausa()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
