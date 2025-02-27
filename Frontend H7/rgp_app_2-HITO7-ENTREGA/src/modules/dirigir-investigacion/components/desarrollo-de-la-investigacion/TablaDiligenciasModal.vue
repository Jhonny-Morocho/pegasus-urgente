<template>
<section class="w-full">
  <AppDataTable
    v-bind="$attrs"
  >
    <Column header="Fecha">
      <template #body="{ data }">
        {{ formatDate(data?.fechaActividad) }}
      </template>
    </Column>
    <Column header="Tipo de Diligencia">
      <template #body="{ data }">
        {{ data?.nombreSubTipoActividad || 'N/A' }}
      </template>
    </Column>
    <Column header="Subtipo de Diligencia">
      <template #body="{ data }">
        {{ data?.nombreSubSubTipoActividad || 'N/A' }}
      </template>
    </Column>
    <Column header="Institución Ejecutora">
      <template #body="{ data }">
        {{ data?.nombreUnidadEjecutora }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{ data }">
        {{ data?.nombreEstado }}
      </template>
    </Column>
    <Column header="Ver Solicitud">
      <template #body="{ data }">
        <div class="flex justify-content-center align-items-center">
          <Button
            v-if="data?.idDocumentoSolicitud"
            class="p-button-text text-blue-900 p-button-lg m-0"
            icon="pi pi-file"
            @click="verSolicitud(data)"
          />
          <span v-else>Sin Documento</span>
        </div>
      </template>
    </Column>
    <Column
      v-if="isEjecutadas"
      header="Ver Resultado"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center align-items-center">
          <Button
            v-if="data?.documento"
            class="p-button-text text-blue-900 p-button-lg m-0"
            icon="pi pi-file"
            @click="verResultado(data)"
          />
          <span v-else>Sin Documento</span>
        </div>
      </template>
    </Column>
  </AppDataTable>
</section>
</template>
<script setup>
import { dateTimeUtil } from '@/utils/dateTime.util.js'
import { defineEmits, defineProps } from 'vue'

defineProps({
  isEjecutadas: Boolean
})

const emit = defineEmits(['ver-solicitud', 'ver-resultado'])

function verSolicitud (diligencia) {
  emit('ver-solicitud', diligencia)
}

function verResultado (diligencia) {
  emit('ver-resultado', diligencia)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
