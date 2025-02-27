<template>
<AppDataTable
  v-bind="$attrs"
  id="tabla-diligencias"
  class="w-full"
>
  <Column header="Diligencia">
    <template #body="{ data }">
      {{ data?.nombreSubTipoActividad || 'N/A' }}
    </template>
  </Column>
  <Column header="Descripción">
    <template #body="{ data }">
      {{ data?.nombreSubSubTipoActividad || 'Sin Descripción' }}
    </template>
  </Column>
  <Column header="Fecha">
    <template #body="{ data }">
      {{ formatoFecha(data?.fechaActividad) }}
    </template>
  </Column>
  <Column header="Institución Ejecutora">
    <template #body="{ data }">
      {{ data?.nombreUnidadEjecutora || 'N/A' }}
    </template>
  </Column>
  <Column header="Solicitud Diligencia">
    <template #body="{ data }">
      <Button
        class="p-button-text p-button-rounded"
        :disabled="!data?.idDocumentoSolicitud"
        icon="pi pi-file"
        @click="verSolicitud(data)"
      />
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data?.nombreEstado || 'N/A' }}
    </template>
  </Column>
  <Column header="Resultado Diligencia">
    <template #body="{ data }">
      <Button
        class="p-button-text p-button-rounded"
        disabled
        icon="pi pi-file"
        @click="verResultado(data)"
      />
    </template>
  </Column>
  <Column header="Acciones">
    <template #body="slotProps">
      <AppMenuOptions
        v-model="selected"
        :menu-options="menuOptions"
        :slot-props="slotProps"
      />
    </template>
  </Column>
</AppDataTable>
</template>

<script setup>
import { dateTimeUtil } from '@/utils'
import { ref, defineEmits } from 'vue'

const emit = defineEmits([
  'ver-diligencia',
  'ver-solicitud',
  'ver-resultado'
])

const selected = ref()

function formatoFecha (fecha) {
  if (fecha) {
    return dateTimeUtil.formatToFrontend(fecha)
  }

  return null
}

function verSolicitud (diligencia) {
  emit('ver-solicitud', diligencia.idDocumentoSolicitud)
}
function verResultado (diligencia) {
  emit('ver-resultado', diligencia)
}

const menuOptions = ref([
  {
    label: 'Ver Diligencia',
    command: () => emit('ver-diligencia', selected.value)
  }
])
</script>
