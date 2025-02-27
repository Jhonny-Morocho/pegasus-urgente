<template>
<AppDataTable
  id="diligencias-instruidas"
  breakpoint="960px"
  class="col-12"
  responsive-layout="stack"
  v-bind="$attrs"
>
  <Column header="Tipo de instrucción">
    <template #body="{ data }">
      {{ data?.nombreSubTipoActividad || 'N/A' }}
    </template>
  </Column>
  <Column header="Descripcion">
    <template #body="{ data }">
      {{ data?.nombreSubSubTipoActividad || 'N/A' }}
    </template>
  </Column>
  <Column header="Fecha de Instrucción">
    <template #body="{ data }">
      {{ formatoFecha(data?.fechaActividad) }}
    </template>
  </Column>
  <Column header="Institución Ejecutora">
    <template #body="{ data }">
      {{ data?.nombreUnidadEjecutora || 'N/A' }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.nombreEstado || 'N/A' }}
    </template>
  </Column>
  <Column header="Ver Solicitud">
    <template #body="{ data }">
      <Button
        v-if="data?.idDocumentoSolicitud"
        class="p-button-rounded p-button-outlined"
        icon="pi pi-file"
        type="button"
        @click="openModalVerDocumento(data?.idDocumentoSolicitud)"
      />
      <div v-else>
        N/A
      </div>
    </template>
  </Column>
  <Column header="Ver Resultado">
    <template #body="{ data }">
      <Button
        class="p-button-rounded p-button-outlined"
        disabled
        icon="pi pi-file"
        type="button"
        @click="openModalVerDocumento(data?.idDocumentoSolicitud)"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'
import { useDynamicDialog } from '@/modules/common/composables'
import ModalVerDocumento from '@/modules/global/components/documentos/ModalVerDocumento.vue'

const { launchDynamicDialog } = useDynamicDialog()

defineProps({
  readOnly: Boolean
})

function openModalVerDocumento (idDocumentoSolicitud) {
  launchDynamicDialog({
    component: ModalVerDocumento,
    header: 'Cargando Documento Solicitud...',
    data: {
      idDocumentoSolicitud: idDocumentoSolicitud
    }
  })
}

function formatoFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontend(fecha)
  }
}

</script>
