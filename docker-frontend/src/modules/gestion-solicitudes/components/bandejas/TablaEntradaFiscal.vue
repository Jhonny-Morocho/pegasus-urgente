<template>
<section class="mt-5">
  <AppDataTable
    id="tabla-entrada-fiscal"
    v-bind="$attrs"
    ref="dt"
    filter-display="menu"
    responsive-layout="scroll"
  >
    <Column header="Ver más">
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :disabled="noColumnMasInfo"
          icon="pi pi-plus"
          @click="openMasInfoTarea(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="prioritario"
      filter-field="prioritario"
      header="Prioritario"
    >
      <template #body="{ data }">
        <Button
          class="p-button-rounded p-button-outlined"
          :class="prioritarioStyle(data?.tarea.taskPriority)"
          icon="pi pi-flag-fill"
          @click="setCausaPrioritaria(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="nombreTarea"
      filter-field="nombreTarea"
      header="Nombre de la Tarea"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline"
          :label="data.tarea.taskName"
          @click="gestionSolicitudes_getBandeja(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="ruc"
      filter-field="ruc"
      header="RUC"
    >
      <template #body="{ data }">
        <Button
          class="p-button-text pl-0 ml-0 btn-primary-outline w-max"
          :label="data?.data?.causa.ruc || 'No disponible'"
          @click="gestionSolicitudes_getBandeja(data)"
        />
      </template>
    </Column>
    <Column
      class="text-center"
      field="alerta"
      filter-field="alerta"
      header="Alerta"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.alerta || 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-left"
      field="imputado"
      filter-field="imputado"
      header="Imputado"
    >
      <template #body="{ data }">
        <section v-if="data?.data?.causa?.imputados?.length > 0">
          {{ `${data?.data?.causa?.imputados[0]?.nombre} ${data?.data?.causa?.imputados[0]?.apellido}` }}
        </section>
        <section v-else>
          N/A
        </section>
      </template>
    </Column>

    <Column
      class="text-left"
      field="delito"
      filter-field="delito"
      header="Delito"
    >
      <template #body="{ data }">
        <section>
          {{ mantenedor_getNombreTipoDelito(data.data?.causa?.delitos[0]?.tipoDelito) || data.data?.causa?.delitos[0]?.hechoDelictual || 'N/A' }}
        </section>
      </template>
    </Column>
    <Column
      class="text-left"
      field="victima"
      filter-field="victima"
      header="Víctima"
    >
      <template #body="{ data }">
        <section v-if="data?.data?.causa?.victimas?.length > 0">
          {{ `${data?.data?.causa?.victimas[0]?.nombre} ${data?.data?.causa?.victimas[0]?.apellido}` }}
        </section>
        <section v-else>
          N/A
        </section>
      </template>
    </Column>

    <Column
      class="text-center"
      field="diasUltimaActividad"
      filter-field="diasUltimaActividad"
      header="Días desde última Actividad"
    >
      <template #body="{ data }">
        {{ data?.data?.causa?.diasUltimaActividad || 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      field="fechaUltimaActividad"
      filter-field="fechaUltimaActividad"
      header="Fecha/Hora última Actividad"
    >
      <template #body="{ data }">
        {{ data?.data?.solicitud?.fechaHoraSolicitud || 'N/A' }}
      </template>
    </Column>
  </AppDataTable>
</section>
</template>

<script setup>
/* eslint-disable no-unreachable */
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useAppDialog } from '@/modules/common/composables'
import { dateTimeUtil } from '@/utils'
import ModalVerMasCausa from '@/modules/dirigir-investigacion/components/modals/ModalVerMasCausa.vue'
import { useMantenedorStore } from '@/modules/global/composables'

const { launchDialog } = useAppDialog()

const { mantenedor_getNombreTipoDelito } = useMantenedorStore()

defineProps({
  noColumnMasInfo: {
    type: Boolean,
    default: () => false
  }
})

const router = useRouter()

function openMasInfoTarea (causa) {
  launchDialog({
    component: ModalVerMasCausa,
    header: 'Más Información de la Causa',
    width: '48%',
    props: { data: causa },
    cancelLabel: 'Cerrar'
  })
}

function gestionSolicitudes_getBandeja (causa) {
  if (causa.tarea.taskName === 'Pide Cuenta') {
    router.push({ name: 'GDSPideCuenta' })
  } else if (causa.tarea.taskName === 'Revisar Solicitud') {
    router.push({ name: 'revisarSolicitudEquipo' })
  } else if (causa.tarea.taskName === 'Resultado Diligencia') {
    router.push({ name: 'resultadoDiligencia' })
  }
}

function prioritarioStyle (value) {
  return value ? 'p-button-secondary' : 'p-button-warning'
}

// eslint-disable-next-line no-unused-vars
function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
