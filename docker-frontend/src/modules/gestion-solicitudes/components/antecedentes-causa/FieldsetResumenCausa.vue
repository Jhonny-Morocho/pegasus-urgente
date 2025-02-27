<template>
<AppFieldset
  legend="Resumen Causa"
  toggleable
>
  <div class="col-12 md:col-6 pl-4 flex flex-column">
    <p>
      <strong>RUC: </strong><span class="text-blue-500 font-medium">{{ ruc }}</span>
    </p>
    <p><strong>Nombre Causa: </strong>{{ resumenCausa?.nombreCausa }}</p>
    <p><strong>Causa Reservada: </strong>{{ resumenCausa?.esReservada ? 'Si' : 'No' }}</p>
    <p><strong>Fecha Creación Causa: </strong>{{ resumenCausa?.fechaCreacion }}</p>
    <p><strong>Fiscalía Local: </strong>{{ resumenCausa?.nombreFiscaliaLocal }}</p>
    <p><strong>Fiscal Asignado: </strong>{{ resumenCausa?.nombreFiscalAsignado }}</p>
    <p><strong>Estado de la Causa: </strong>{{ resumenCausa?.descripcionEstado }}</p>
    <p><strong>Fecha de Prescripción: </strong>{{ resumenCausa?.fechaPrescripcion }}</p>
  </div>
  <div class="col-12 md:col-6 pl-4 flex flex-column">
    <p><strong>Proceso de la Causa: </strong>{{ resumenCausa?.descripcionProceso }}</p>
    <p><strong>Estado de las Relaciones de la Causa: </strong>?</p>
    <p><strong>Etapa de las Relaciones de la Causa: </strong>{{ resumenCausa?.etapaRelacionesCausa }}</p>
    <p><strong>Estado Procesal: </strong>?</p>
    <p><strong>Fecha Asignación: </strong>{{ resumenCausa?.fechaAsignacion }}</p>
    <p><strong>Fecha Formalización: </strong>{{ resumenCausa?.fechaFormalizacion }}</p>
    <p><strong>Plazo investigación: </strong>{{ resumenCausa?.plazoInvestigacionDias }} DÍAS</p>
  </div>
</AppFieldset>
</template>

<script setup>
import { onMounted } from 'vue'
import { requestUtil } from '@/utils'
import { useDirigirInvestigacionStore } from '@/modules/dirigir-investigacion/composables'

const {
  ruc,
  resumenCausa,
  dirigirInvestigacion_getResumenCausa
} = useDirigirInvestigacionStore()

function getResumenCausa () {
  requestUtil({
    action: dirigirInvestigacion_getResumenCausa,
    payload: { ruc: ruc.value }
  })
}
onMounted(() => {
  getResumenCausa()
})
</script>

<style scoped>
p {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
</style>
