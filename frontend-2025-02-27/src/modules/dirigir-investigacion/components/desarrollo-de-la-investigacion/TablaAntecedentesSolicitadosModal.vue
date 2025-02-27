<template>
<section class="w-full">
  <AppDataTable
    class="w-full"
    v-bind="$attrs"
  >
    <Column header="Fecha">
      <template #body="{ data }">
        {{ formatDate(data?.fechaActividad) }}
      </template>
    </Column>
    <Column header="Solicitud">
      <template #body="{ data }">
        {{ data.nombreSubTipoActividad }}{{ data.nombreSubSubTipoActividad ? ` - ${data.nombreSubSubTipoActividad}` : '' }}
      </template>
    </Column>
    <Column header="Institución Ejecutora">
      <template #body="{ data }">
        {{ data?.nombreInstitucionEjecutora || 'N/A' }}
      </template>
    </Column>
    <Column header="Estado">
      <template #body="{ data }">
        {{ data?.nombreEstado || 'N/A' }}
      </template>
    </Column>
    <Column
      class="text-center"
      header="Ver Solicitud"
    >
      <template #body="{ data }">
        <div class="flex justify-content-center align-items-center">
          <Button
            v-if="data?.documento"
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
            v-if="data?.documentoUrl"
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

function verResultado (antecendete) {
  emit('ver-resultado', antecendete)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontend(date)
}
</script>
