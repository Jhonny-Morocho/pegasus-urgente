<template>
<AppDataTable
  id="tabla-historial-causa"
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Actividad">
    <template #body="{ data }">
      {{ data.tipoActividad }}
    </template>
  </Column>
  <Column header="Fecha Actividad">
    <template #body="{ data }">
      {{ formatDate(data.fechaActualizacion) }}
    </template>
  </Column>
  <Column header="Etapa">
    <template #body="{ data }">
      {{ data.procesoTitulo }}
    </template>
  </Column>
  <Column header="Origen">
    <template #body="{ data }">
      {{ data.origen }}
    </template>
  </Column>
  <Column header="Autor o ejecutor">
    <template #body="{ data }">
      {{ data.usuario }}
    </template>
  </Column>
  <Column header="Rol">
    <template #body="{ data }">
      {{ data.rol }}
    </template>
  </Column>
  <Column header="Estado">
    <template #body="{ data }">
      {{ data.estado }}
    </template>
  </Column>
  <Column header="Documentos">
    <template #body="{ data }">
      <div class="flex justify-content-center align-items-center text-5xl">
        <Button
          class="p-button-text p-button-lg"
          icon="pi pi-file"
          @click="verDocumento(data)"
        />
      </div>
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { defineEmits } from 'vue'
import { dateTimeUtil } from '@/utils/dateTime.util.js'

const emit = defineEmits(['ver-documento'])

function verDocumento (data) {
  emit('ver-documento', data)
}

function formatDate (date) {
  return dateTimeUtil.formatToFrontendWithTime(date)
}
</script>
