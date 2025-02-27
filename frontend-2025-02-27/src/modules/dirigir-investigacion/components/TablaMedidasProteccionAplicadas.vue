<template>
<AppDataTable
  class="w-full"
  v-bind="$attrs"
>
  <Column header="Medida de Protección">
    <template #body="{ data }">
      {{ data?.tipoMedida }}
    </template>
  </Column>
  <Column header="Vigencia">
    <template #body="{ data }">
      {{ getVigencia(data) }}
    </template>
  </Column>
  <Column
    v-if="withActions"
    class="flex md:justify-content-center md:align-items-center"
    header="Acciones"
  >
    <template #body="{ data }">
      <Button
        class="p-button-outlined p-button-danger p-button-rounded"
        icon="pi pi-trash"
        @click="eliminarMedida(data)"
      />
    </template>
  </Column>
</AppDataTable>
</template>
<script setup>
import { defineEmits, defineProps } from 'vue'
import { dateTimeUtil } from '@/utils'

defineProps({
  withActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['eliminar-medida'])

function eliminarMedida (medida) {
  emit('eliminar-medida', medida)
}

function getVigencia (data) {
  const desde = formatDate(data?.fechaInicio)
  const hasta = formatDate(data?.fechaFin)

  if (desde && hasta) {
    return `${desde} al ${hasta}`
  } else {
    return `${desde}`
  }
}

function formatDate (date) {
  if (!date) {
    return null
  }
  return dateTimeUtil.formatToFrontend(date)
}
</script>
