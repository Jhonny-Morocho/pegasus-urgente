<template>
<AppDataTable
  id="diligencias-instruidas"
  breakpoint="960px"
  class="col-12"
  responsive-layout="stack"
  v-bind="$attrs"
>
  <Column header="Fecha de Instrucción">
    <template #body="{ data }">
      {{ formatoFecha(data?.tarea?.fechaSolicitud) || formatoFecha(data?.fechaActividad) }}
    </template>
  </Column>
  <Column header="Tipo de Diligencia">
    <template #body="{ data }">
      {{ data?.nombreSubTipoActividad || 'N/A' }}
    </template>
  </Column>
  <Column header="Subtipo Diligencia">
    <template #body="{ data }">
      {{ data?.nombreSubSubTipoActividad || 'N/A' }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ nombreEstado(data?.tarea?.idEstado) || data?.nombreEstado || 'N/A' }}
    </template>
  </Column>
  <Column header="Institución Ejecutora">
    <template #body="{ data }">
      {{ nombreInstitucion(data?.tarea?.idInstitucionEjecutora) || data?.nombreUnidadEjecutora || 'N/A' }}
    </template>
  </Column>
  <Column header="Diligencias / Instrucción">
    <template #body="{ data }">
      {{ data?.observacionHito || 'N/A' }}
    </template>
  </Column>
  <Column header="Plazo">
    <template #body="{ data }">
      {{ data?.plazoDescripcion || 'N/A' }}
    </template>
  </Column>
  <Column header="Documento">
    <template #body="{ data }">
      <Button
        v-if="data?.idDocumentoSolicitud"
        class="p-button-rounded p-button-outlined"
        icon="pi pi-file"
        type="button"
        @click="showDocument(data?.idDocumentoSolicitud)"
      />
      <span v-else>Sin Documento</span>
    </template>
  </Column>
  <slot name="acciones" />
</AppDataTable>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { defineEmits } from 'vue'
import { useMantenedorStore } from '@/modules/global/composables'

const {
  estadoMedidaHito,
  mantenedor_getNombreInstitucion
} = useMantenedorStore()

const emit = defineEmits([
  'ver-documento'
])

function showDocument (docUrl) {
  emit('ver-documento', docUrl)
}

function nombreEstado (idEstado) {
  const estadoFound = estadoMedidaHito.value.find(estado => estado.id === idEstado?.toUpperCase())
  return estadoFound?.descripcion
}

function nombreInstitucion (idInstitucionEjecutora) {
  return mantenedor_getNombreInstitucion(idInstitucionEjecutora)
}

function formatoFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontend(fecha)
  }
}

</script>
