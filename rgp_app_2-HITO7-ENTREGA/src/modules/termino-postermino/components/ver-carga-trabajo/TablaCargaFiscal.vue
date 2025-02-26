<template>
<AppDataTable
  id="dataTableCargaFiscal"
  class="col-12"
  v-bind="$attrs"
>
  <Column header="Nombre del Fiscal">
    <template #body="{ data }">
      {{ data.nombreFiscal }}
    </template>
  </Column>
  <Column header="Especialidad">
    <template #body="{ data }">
      {{ data.especialidad }}
    </template>
  </Column>
  <Column header="Total Causas Asignadas Último Mes">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, 1, null)">
        {{ data.mensual }}
      </span>
    </template>
  </Column>
  <Column header="Total Causas Asignadas últimos 6 meses">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, 6, null)">
        {{ data.seisMensual }}
      </span>
    </template>
  </Column>
  <Column header="Total Causas Asignadas Últimos 12 Meses">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, 12, null)">
        {{ data.anual }}
      </span>
    </template>
  </Column>
  <Column header="Total causas vigentes">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, null, vigente)">
        {{ data.vigentes }}
      </span>
    </template>
  </Column>
  <Column header="Total Causas Tramitadas">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, null, terminada)">
        {{ data.tramitadas }}
      </span>
    </template>
  </Column>
  <Column header="Total Causas Terminadas">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, null, terminada)">
        {{ data.terminadas }}
      </span>
    </template>
  </Column>
  <Column header="Total Causas Suspendidas">
    <template #body="{ data }">
      <span @click="openTotalCausas(data, null, suspendida)">
        {{ data.suspendidas }}
      </span>
    </template>
  </Column>
  <Column header="Total Causas con Acuerdo Reparatorio">
    <template #body="{ data }">
      <span @click="openTotalCausas(data)">
        {{ data.acuerdo }}
      </span>
    </template>
  </Column>
  <Column header="Tiempo Promedio Tramitar Causa (días).">
    <template #body="{ data }">
      {{ data.promedio }}
    </template>
  </Column>
  <Column header="Fecha ultima Asignacion">
    <template #body="{ data }">
      {{ formatDate(data.fechaUltimaAsignacion) }}
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { useAppDialog } from '@/modules/common/composables'
import { dateTimeUtil } from '@/utils'
import ModalCausasAcuerdoReparatorio from '@/modules/termino-postermino/components/ver-carga-trabajo/ModalCausasAcuerdoReparatorio.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const { launchDialog } = useAppDialog()
const { estadosCausa } = useMantenedorStore()

// Estados de causa 
const vigente = estadosCausa.value.find(x => x.descripcion === 'Vigente')?.id
const terminada = estadosCausa.value.find(x => x.descripcion === 'Terminada')?.id
const suspendida = estadosCausa.value.find(x => x.descripcion === 'Suspendida')?.id

function formatDate (value) {
  return dateTimeUtil.formatToFrontendWithTime(value)
}

function openTotalCausas (data, meses, estadoCausa) {
  launchDialog({
    component: ModalCausasAcuerdoReparatorio,
    header: `${data.nombreFiscal}`,
    width: '90%',
    props: {
      cargaFiscal: true,
      data: data,
      mes: meses,
      idEstadoCausa: estadoCausa
    }
  })
}
</script>

<style scoped>
span {
  color: #2c6ddf;
  cursor: pointer;
}
</style>
